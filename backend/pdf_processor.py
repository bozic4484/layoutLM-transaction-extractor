import os
from dotenv import load_dotenv
import fitz
import torch
from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
from PIL import Image
import numpy as np
from typing import List, Dict, Any
import re
import json
import csv
from io import StringIO
from datetime import datetime

class PDFProcessor:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Initialize LayoutLMv3 for better visual and textual understanding
        model_name = "microsoft/layoutlmv3-base"
        auth_token = os.getenv('HUGGINGFACE_TOKEN')
        
        # Update labels to focus on transaction data
        self.label_list = [
            "O",  # Outside
            "B-DATE", "I-DATE",  # Transaction Date
            "B-DESC", "I-DESC",  # Description
            "B-AMOUNT", "I-AMOUNT",  # Amount
            "B-STATUS", "I-STATUS",  # Transaction Status
        ]
        
        # Configure model settings
        model_config = {
            "num_labels": len(self.label_list),
            "id2label": {i: label for i, label in enumerate(self.label_list)},
            "label2id": {label: i for i, label in enumerate(self.label_list)}
        }
        
        # Initialize model and processor
        self.processor = LayoutLMv3Processor.from_pretrained(
            model_name,
            token=auth_token,
            apply_ocr=False
        )
        
        self.model = LayoutLMv3ForTokenClassification.from_pretrained(
            model_name,
            token=auth_token,
            **model_config
        )

        # Initialize classifier weights properly
        self.model.classifier.weight.data.normal_(mean=0.0, std=0.02)
        self.model.classifier.bias.data.zero_()

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Enhanced image preprocessing for better OCR results"""
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Improve image quality
        image = image.resize((image.width * 2, image.height * 2), Image.Resampling.LANCZOS)
        return image

    def extract_structured_data(self, texts: List[str], boxes: List[List[int]], 
                              predictions: List[int]) -> Dict[str, Any]:
        """Extract structured transaction data"""
        transactions = []
        current_transaction = {}
        
        # Join multi-line texts
        combined_text = "\n".join(texts)
        
        # Extract transactions using regex patterns
        transaction_pattern = r"(\d{2}\s+[A-Za-z]+,\s+\d{4})\n([^\n]+)\n([+-]?[\d,]+\.\d{2}\s+USD)\n(Completed|Canceled)"
        matches = re.finditer(transaction_pattern, combined_text)
        
        for match in matches:
            date, description, amount, status = match.groups()
            
            # Clean and format the data
            amount_value = float(re.sub(r'[^\d.-]', '', amount))
            
            transaction = {
                "date": date.strip(),
                "description": description.strip(),
                "amount": amount_value,
                "status": status.strip()
            }
            
            transactions.append(transaction)

        return {
            "transactions": transactions,
            "metadata": self.extract_metadata(texts)
        }

    def extract_metadata(self, texts: List[str]) -> Dict[str, str]:
        """Extract document metadata"""
        metadata = {}
        
        # Extract period
        period_pattern = r"Period\s*(\d{2}/\d{2}/\d{4}\s*-\s*\d{2}/\d{2}/\d{4})"
        period_match = re.search(period_pattern, "\n".join(texts))
        if period_match:
            metadata["period"] = period_match.group(1)

        # Extract account holder
        name_pattern = r"^([A-Za-z\s]+)\nPeriod"
        name_match = re.search(name_pattern, "\n".join(texts), re.MULTILINE)
        if name_match:
            metadata["account_holder"] = name_match.group(1).strip()

        return metadata

    async def process_pdf(self, content: bytes) -> dict:
        """Process PDF and extract transaction data"""
        pdf_document = fitz.open(stream=content, filetype="pdf")
        results = []
        
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            
            # Convert page to image
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img = self.preprocess_image(img)
            
            # Extract text blocks
            text_blocks = page.get_text("blocks")
            texts = [block[4] for block in text_blocks if block[4].strip()]
            
            # Process with LayoutLMv3 if needed
            if texts:
                try:
                    with torch.no_grad():
                        encoding = self.processor(
                            images=[img],
                            text=texts,
                            return_tensors="pt",
                            padding=True,
                            truncation=True
                        )
                        outputs = self.model(**encoding)
                        predictions = outputs.logits.argmax(-1).squeeze().tolist()
                        if isinstance(predictions, int):
                            predictions = [predictions]
                except Exception as e:
                    print(f"Warning: Model inference failed - {str(e)}")
                    predictions = []
            else:
                predictions = []
            
            # Extract structured data
            structured_data = self.extract_structured_data(texts, [], predictions)
            
            results.append({
                "page": page_num + 1,
                **structured_data
            })
        
        return results

    def normalize_bbox(self, x0: float, y0: float, x1: float, y1: float, 
                      width: int, height: int) -> List[int]:
        """Normalize bounding box coordinates"""
        return [
            min(max(int(x0 * 1000 / width), 0), 1000),
            min(max(int(y0 * 1000 / height), 0), 1000),
            min(max(int(x1 * 1000 / width), 0), 1000),
            min(max(int(y1 * 1000 / height), 0), 1000)
        ]

    def export_to_json(self, results: List[Dict]) -> str:
        """Export results to JSON format"""
        return json.dumps(results, indent=2)

    def export_to_csv(self, results: List[Dict]) -> str:
        """Export transaction data to CSV format"""
        output = StringIO()
        fieldnames = ["date", "description", "amount", "status"]
        
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        
        for result in results:
            for transaction in result["transactions"]:
                writer.writerow({
                    "date": transaction["date"],
                    "description": transaction["description"],
                    "amount": transaction["amount"],
                    "status": transaction["status"]
                })
        
        return output.getvalue() 
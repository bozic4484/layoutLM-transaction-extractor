from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pdf_processor import PDFProcessor
from fastapi.responses import JSONResponse, PlainTextResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pdf_processor = PDFProcessor()

@app.post("/process-pdf")
async def process_pdf(
    file: UploadFile = File(...),
    format: str = Query("json", enum=["json", "csv"])
):
    content = await file.read()
    result = await pdf_processor.process_pdf(content)
    
    if format == "csv":
        csv_content = pdf_processor.export_to_csv(result)
        return PlainTextResponse(
            content=csv_content,
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment;filename=transactions.csv"
            }
        )
    
    return JSONResponse(content={"result": result}) 
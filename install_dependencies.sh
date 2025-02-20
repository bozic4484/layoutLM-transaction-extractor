#!/bin/bash
echo "Installing dependencies..."

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install PyTorch
pip install torch torchvision torchaudio

# Install Detectron2
pip install 'git+https://github.com/facebookresearch/detectron2.git'

# Install other requirements
pip install -r backend/requirements.txt

echo "Installation complete!" 
@echo off
echo Installing dependencies...

:: Create and activate virtual environment
python -m venv venv
call venv\Scripts\activate

:: Install PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

:: Install Detectron2
pip install git+https://github.com/facebookresearch/detectron2.git

:: Install other requirements
pip install -r backend/requirements.txt

echo Installation complete! 
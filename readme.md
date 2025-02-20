# PDF Transaction Extractor

A powerful web application that extracts and processes transaction data from PDF documents using advanced OCR and machine learning techniques. Built with FastAPI, React, and LayoutLMv3.

## Features

- 📄 PDF document processing with advanced OCR capabilities
- 🤖 Machine learning-powered transaction data extraction using LayoutLMv3
- 💰 Automatic identification of transaction details (date, amount, description, status)
- 📊 Export results in both JSON and CSV formats
- 🎯 High accuracy in detecting and structuring financial data
- 🌐 Modern web interface with real-time processing status

## Tech Stack

### Backend
- FastAPI - Modern Python web framework
- PyMuPDF - PDF processing library
- LayoutLMv3 - Document understanding AI model
- Transformers - Hugging Face's ML library
- Python 3.8+

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- pip and npm package managers

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/pdf-transaction-extractor.git
cd pdf-transaction-extractor
```

2. Create and activate a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env file with your configuration
```

### Frontend Setup

1. Install frontend dependencies
```bash
cd frontend
npm install
```

2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

## Usage

### Starting the Backend Server

1. Activate the virtual environment (if not already activated)
```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Start the FastAPI server
```bash
cd backend
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Starting the Frontend Development Server

1. In a new terminal, navigate to the frontend directory
```bash
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:3000`

## API Documentation

Once the backend server is running, you can access:
- Interactive API documentation: `http://localhost:8000/docs`
- Alternative API documentation: `http://localhost:8000/redoc`

## Configuration

### Backend Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET_KEY=your_secret_key
MODEL_PATH=path/to/model
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your PR adheres to:
- Consistent code style
- Proper documentation
- Appropriate test coverage

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [LayoutLMv3](https://github.com/microsoft/unilm/tree/master/layoutlmv3) - Microsoft Research
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/pdf-transaction-extractor/issues) page
2. Create a new issue if your problem isn't already listed

## Authors

- Your Name - Initial work - [YourGithubUsername](https://github.com/yourusername)

## Project Status

This project is actively maintained and welcomes contributions from the community.
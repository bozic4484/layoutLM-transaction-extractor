import React, { useState } from 'react';
import axios from 'axios';
import { ProcessingStatus } from './ProcessingStatus';
import { ResultDisplay } from './ResultDisplay';
import { UploadError } from './UploadError';
import { ProcessedResult } from '../types';

export const PDFUploader: React.FC = () => {
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<'json' | 'csv'>('json');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      if (format === 'csv') {
        const response = await axios.post('http://localhost:8000/process-pdf?format=csv', formData, {
          responseType: 'blob',
        });
        
        // Create download link for CSV
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const response = await axios.post('http://localhost:8000/process-pdf?format=json', formData);
        setResults(response.data.result);
      }
    } catch (error) {
      setError('Error processing PDF. Please try again.');
      console.error('Error processing PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload PDF Document
        </label>
        <div className="flex gap-4 mb-4">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'json' | 'csv')}
            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="json">JSON Format</option>
            <option value="csv">CSV Format</option>
          </select>
        </div>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer"
        />
      </div>

      {loading && <ProcessingStatus />}
      {error && <UploadError message={error} />}
      {format === 'json' && results.length > 0 && <ResultDisplay results={results} />}
    </div>
  );
}; 
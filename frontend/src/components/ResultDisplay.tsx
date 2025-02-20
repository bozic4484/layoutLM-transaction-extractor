import React, { useState } from 'react';
import { ProcessedResult } from '../types';

interface Props {
  results: ProcessedResult[];
}

export const ResultDisplay: React.FC<Props> = ({ results }) => {
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  const renderJsonView = (data: any) => {
    return (
      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-[500px]">
        <code className="text-sm text-gray-800">
          {JSON.stringify(data, null, 2)}
        </code>
      </pre>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'table'
                ? 'bg-blue-500 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'json'
                ? 'bg-blue-500 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            JSON View
          </button>
        </div>
      </div>

      {results.map((result, pageIndex) => (
        <div key={pageIndex} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Page {result.page}</h2>

          {viewMode === 'json' ? (
            // JSON View
            renderJsonView(result)
          ) : (
            // Table View
            <>
              {/* Metadata Section */}
              {result.metadata && Object.keys(result.metadata).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Statement Information</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    {Object.entries(result.metadata).map(([key, value], idx) => (
                      <div key={idx} className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Transactions Section */}
              {result.transactions && result.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.transactions.map((transaction, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                              ${Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'Completed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No transactions found on this page</p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}; 
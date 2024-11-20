import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileWarning, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { processFile } from '../utils/fileProcessor';
import { useDispatch } from 'react-redux';
import { addInvoice } from '../store/slices/invoicesSlice';
import { addProduct } from '../store/slices/productsSlice';
import { addCustomer } from '../store/slices/customersSlice';
import FeedbackBox from './common/FeedbackBox';

const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    details?: string;
    validationFields?: { field: string; message: string }[];
  } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      for (const file of acceptedFiles) {
        const result = await processFile(file);
        console.log('Processed data:', result);

        const { invoices, products, customers, validationErrors } = result;

        invoices.forEach(invoice => dispatch(addInvoice(invoice)));
        products.forEach(product => dispatch(addProduct(product)));
        customers.forEach(customer => dispatch(addCustomer(customer)));

        if (validationErrors && validationErrors.length > 0) {
          setFeedback({
            type: 'warning',
            message: `Processed ${file.name} with validation errors`,
            details: `Added ${invoices.length} invoices, ${products.length} products, and ${customers.length} customers despite validation errors.`,
            validationFields: validationErrors.map(error => ({
              field: typeof error === 'string' ? 'general' : error.field,
              message: typeof error === 'string' ? error : error.message
            }))
          });
        } else {
          setFeedback({
            type: 'success',
            message: `Successfully processed ${file.name}`,
            details: `Added ${invoices.length} invoices, ${products.length} products, and ${customers.length} customers.`
          });
        }
      }
    } catch (error) {
      console.error('File processing error:', error);
      setFeedback({
        type: 'error',
        message: 'Error processing files',
        details: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
          } transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-lg font-medium text-blue-500">Processing files...</p>
            </>
          ) : isDragActive ? (
            <>
              <FileWarning className="w-12 h-12 text-blue-500" />
              <p className="text-lg font-medium text-blue-500">Drop files here...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, Excel (.xlsx, .xls), and images
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {feedback && (
        <FeedbackBox
          type={feedback.type}
          message={feedback.message}
          details={feedback.details}
          validationFields={feedback.validationFields}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
};

export default FileUpload;
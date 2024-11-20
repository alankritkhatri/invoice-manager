import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface ValidationField {
    field: string;
    message: string;
}

interface FeedbackBoxProps {
    type: FeedbackType;
    message: string;
    details?: string;
    validationFields?: ValidationField[];
    onClose?: () => void;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({
    type,
    message,
    details,
    validationFields,
    onClose,
}) => {
    const configs = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            textColor: 'text-green-800',
            borderColor: 'border-green-200',
            iconColor: 'text-green-400',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            textColor: 'text-red-800',
            borderColor: 'border-red-200',
            iconColor: 'text-red-400',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-200',
            iconColor: 'text-yellow-400',
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-400',
        },
    };

    const config = configs[type];
    const Icon = config.icon;

    const formatFieldName = (field: string) => {
        return field
            .split('.')
            .map(part => part.replace(/_/g, ' '))
            .join(' → ')
            .replace(/\[\d+\]/g, '')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${config.textColor}`}>{message}</h3>
                    {details && (
                        <div className={`mt-2 text-sm ${config.textColor} opacity-90`}>
                            {details}
                        </div>
                    )}
                    {validationFields && validationFields.length > 0 && (
                        <div className="mt-4">
                            <h4 className={`text-sm font-medium ${config.textColor} mb-2`}>
                                Required Fields:
                            </h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {validationFields.map((field, index) => (
                                    <li key={index} className={`text-sm ${config.textColor}`}>
                                        <span className="font-medium">{formatFieldName(field.field)}</span>
                                        {field.message && ` - ${field.message}`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackBox;

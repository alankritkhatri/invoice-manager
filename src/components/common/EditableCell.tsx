import React, { useState, useEffect } from 'react';

interface EditableCellProps {
    value: string | number;
    isEditing: boolean;
    type?: 'text' | 'number' | 'email' | 'tel' | 'date';
    onSave: (value: string | number) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    value,
    isEditing,
    type = 'text',
    onSave,
}) => {
    const [editValue, setEditValue] = useState(value);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    if (!isEditing) {
        return <span className="block w-full">{value}</span>;
    }

    const handleSave = () => {
        let processedValue = editValue;
        if (type === 'number') {
            processedValue = Number(editValue) || 0;
        }
        onSave(processedValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setEditValue(value);
            onSave(value);
        }
    };

    return (
        <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
        />
    );
};

export default EditableCell; 
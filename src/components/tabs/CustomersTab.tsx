import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateCustomer } from '../../store/slices/customersSlice';
import { Customer } from '../../types';
import EditableCell from '../common/EditableCell';
import { Pencil, Save, X } from 'lucide-react';

const CustomersTab: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.customers);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (customer: Customer) => {
    dispatch(updateCustomer(customer));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Purchase Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((customer) => {
            const isEditing = editingId === customer.id;
            return (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <EditableCell
                    value={customer.name}
                    isEditing={isEditing}
                    onSave={(value) => handleSave({ ...customer, name: value.toString() })}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <EditableCell
                    value={customer.phoneNumber}
                    isEditing={isEditing}
                    type="tel"
                    onSave={(value) => handleSave({ ...customer, phoneNumber: value.toString() })}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${customer.totalPurchaseAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <EditableCell
                    value={customer.email || ''}
                    isEditing={isEditing}
                    type="email"
                    onSave={(value) => handleSave({ ...customer, email: value.toString() })}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <EditableCell
                    value={customer.address || ''}
                    isEditing={isEditing}
                    onSave={(value) => handleSave({ ...customer, address: value.toString() })}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(customer)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(customer.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No customers found. Upload some files to get started.
        </div>
      )}
    </div>
  );
};

export default CustomersTab;
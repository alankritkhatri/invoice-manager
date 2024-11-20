import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateInvoice } from '../../store/slices/invoicesSlice';
import EditableCell from '../common/EditableCell';
import { format } from 'date-fns';
import { FileText, DollarSign, Users, TrendingUp, Pencil, Save, X } from 'lucide-react';
import StatsCard from '../common/StatsCard';

const InvoicesTab: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.invoices);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (invoice: any) => {
    dispatch(updateInvoice(invoice));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  const totalAmount = items.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalTax = items.reduce((sum, invoice) => sum + invoice.tax, 0);
  const uniqueCustomers = new Set(items.map(invoice => invoice.customerName)).size;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalAmount.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Total Tax Collected"
          value={`$${totalTax.toFixed(2)}`}
          icon={TrendingUp}
        />
        <StatsCard
          title="Unique Customers"
          value={uniqueCustomers}
          icon={Users}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <EditableCell
                      value={invoice.serialNumber}
                      isEditing={editingId === invoice.id}
                      onSave={(value) => handleSave({ ...invoice, serialNumber: value.toString() })}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EditableCell
                      value={invoice.customerName}
                      isEditing={editingId === invoice.id}
                      onSave={(value) => handleSave({ ...invoice, customerName: value.toString() })}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EditableCell
                      value={invoice.productName}
                      isEditing={editingId === invoice.id}
                      onSave={(value) => handleSave({ ...invoice, productName: value.toString() })}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <EditableCell
                      value={invoice.quantity}
                      isEditing={editingId === invoice.id}
                      onSave={(value) => handleSave({ ...invoice, quantity: value.toString() })}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.tax.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${invoice.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(invoice.date), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No invoices found</p>
            <p className="text-gray-500 mt-1">Upload some files to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesTab;
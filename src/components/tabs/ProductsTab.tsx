import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateProduct } from '../../store/slices/productsSlice';
import { Package, DollarSign, Percent, Archive } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import EditableCell from '../common/EditableCell';
import { Pencil, Save, X } from 'lucide-react';

const ProductsTab: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.products);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  const totalValue = items.reduce((sum, product) => sum + (product.unitPrice * product.quantity), 0);
  const totalItems = items.reduce((sum, product) => sum + product.quantity, 0);
  const averageDiscount = items.reduce((sum, product) => sum + (product.discount || 0), 0) / items.length || 0;

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (product: any) => {
    dispatch(updateProduct(product));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Inventory Value"
          value={`$${totalValue.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={Archive}
        />
        <StatsCard
          title="Average Discount"
          value={`${averageDiscount.toFixed(1)}%`}
          icon={Percent}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price with Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((product) => {
                const isEditing = editingId === product.id;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <EditableCell
                        value={product.name}
                        isEditing={isEditing}
                        onSave={(value) => handleSave({ ...product, name: value.toString() })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        value={product.quantity}
                        isEditing={isEditing}
                        type="number"
                        onSave={(value) => handleSave({ ...product, quantity: Number(value) })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        value={product.unitPrice}
                        isEditing={isEditing}
                        type="number"
                        onSave={(value) => handleSave({ ...product, unitPrice: Number(value) })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        value={product.tax}
                        isEditing={isEditing}
                        type="number"
                        onSave={(value) => handleSave({ ...product, tax: Number(value) })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.priceWithTax.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <EditableCell
                        value={product.discount || 0}
                        isEditing={isEditing}
                        type="number"
                        onSave={(value) => handleSave({ ...product, discount: Number(value) })}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSave(product)}
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
                          onClick={() => handleEdit(product.id)}
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
        </div>
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No products found</p>
            <p className="text-gray-500 mt-1">Upload some files to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
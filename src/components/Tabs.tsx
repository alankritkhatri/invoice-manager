import React, { useState } from 'react';
import InvoicesTab from './tabs/InvoicesTab';
import ProductsTab from './tabs/ProductsTab';
import CustomersTab from './tabs/CustomersTab';
import { FileText, Package, Users } from 'lucide-react';

const tabs = [
  { id: 'invoices', label: 'Invoices', icon: FileText, component: InvoicesTab },
  { id: 'products', label: 'Products', icon: Package, component: ProductsTab },
  { id: 'customers', label: 'Customers', icon: Users, component: CustomersTab },
];

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || InvoicesTab;

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Tabs;
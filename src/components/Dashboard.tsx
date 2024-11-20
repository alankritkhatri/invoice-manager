import React from 'react';
import FileUpload from './FileUpload';
import Tabs from './Tabs';
import { FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Swipe Invoice Manager
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <FileUpload />
                    </div>
                    <div className="bg-white shadow rounded-lg">
                        <Tabs />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
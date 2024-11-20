import React from 'react';
import { FileText, Zap, Shield, BarChart3, ArrowDown } from 'lucide-react';
import Feature from './Feature.tsx';
import FloatingElements from './FloatingElements.tsx';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c')] bg-cover bg-center opacity-10"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 animate-fade-in">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Swipe Invoice Manager
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Transform your invoice management with AI-powered automation. Extract, process, and organize data from any format instantly.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-200"
            >
              Get Started
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Feature
                icon={<Zap className="h-8 w-8 text-yellow-400" />}
                title="AI-Powered Extraction"
                description="Extract data automatically from PDFs, Excel files, and images."
              />
              <Feature
                icon={<FileText className="h-8 w-8 text-green-400" />}
                title="Multi-Format Support"
                description="Process invoices from any format - PDFs, Excel sheets, or photos."
              />
              <Feature
                icon={<Shield className="h-8 w-8 text-red-400" />}
                title="Data Validation"
                description="Automatic validation ensures accuracy and completeness."
              />
              <Feature
                icon={<BarChart3 className="h-8 w-8 text-blue-400" />}
                title="Real-time Analytics"
                description="Track customer spending and business metrics instantly."
              />
            </div>
          </div>
        </div>
      </div>

      <FloatingElements />
    </div>
  );
};

export default LandingPage;
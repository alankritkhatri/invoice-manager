import React from 'react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
    <div className="relative p-6 bg-black bg-opacity-50 rounded-lg backdrop-blur-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default Feature;
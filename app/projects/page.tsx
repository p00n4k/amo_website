'use client';
import { useState } from 'react';

const tabs = ['Residence', 'Commercial'];

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState('Residence');

  return (
    <div className="bg-[#2d2d2d] min-h-screen text-white px-4 py-8 pt-50">

      {/* Header */}
      <p className="text-sm mb-4">
        We have a diverse body of work and utilize various materials.
      </p>

      {/* Search Input */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by Collection Name..."
          className="w-full px-4 py-2 rounded-full bg-gray-700 text-white outline-none"
        />
      </div>

      {/* Clear All */}
      <button className="bg-gray-800 text-white px-4 py-2 rounded-full mb-6">
        Clear All
      </button>

      {/* Tabs */}
      <div className="flex space-x-12 mb-8 border-b border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-lg font-medium ${activeTab === tab
              ? 'border-b-4 border-white text-white'
              : 'text-gray-400'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white text-black rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative h-60">
              <img
                src="/images/sample_project.jpg" // replace with actual image path
                alt="Project"
                className="w-full h-full object-cover"
              />
              {/* Optional Zoom Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="w-12 h-12 border-4 border-white rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🔍</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Project Name</h2>
              <div className="text-sm text-gray-500">4 Feb 2022</div>
              <h3 className="mt-2 font-semibold">Product Overview</h3>
              <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                <li>Product Collection</li>
                <li>Product Collection</li>
                <li>Product Collection</li>
              </ul>
              <div className="text-right mt-2">
                <a href="#" className="text-blue-600 text-sm">
                  Read Full
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;

'use client';
import { useState } from 'react';

const tabs = ['Residence', 'Commercial'];

const imageSets = [
  ['/images/sample_project/sample_project.png', '/images/sample_project/Lemmy.jpg'],
  ['/images/sample_project/sample_project.png', '/images/sample_project/Lemmy.jpg'],
  ['/images/sample_project/sample_project.png', '/images/sample_project/Lemmy.jpg'],
];

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState('Residence');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);

  const openModal = (images: string[]) => {
    setModalImages(images);
    setCurrentModalIndex(0);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const nextModalImage = () =>
    setCurrentModalIndex((prev) => (prev + 1) % modalImages.length);

  const prevModalImage = () =>
    setCurrentModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);

  return (
    <div className="bg-[#2d2d2d] min-h-screen text-white px-4 py-8 pt-50">
      <p className="text-sm mb-4">
        We have a diverse body of work and utilize various materials.
      </p>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by Collection Name..."
          className="w-full px-4 py-2 rounded-full bg-gray-700 text-white outline-none"
        />
      </div>

      <button className="bg-gray-800 text-white px-4 py-2 rounded-full mb-6">
        Clear All
      </button>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {imageSets.map((images, i) => (
          <div
            key={i}
            className="bg-white text-black rounded-lg overflow-hidden shadow-md"
          >
            <div
              className="relative h-60 cursor-pointer"
              onClick={() => openModal(images)}
            >
              <img
                src={images[0]} // main image
                alt="Project"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-lg">Click to View</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Project Name</h2>
                <a href="/projectdetail" className="text-blue-600 text-sm">
                  Read Full
                </a>
              </div>

              <div className="pl-4 pb-5">
                <div className="text-sm text-gray-500">4 Feb 2022</div>
                <h3 className="mt-2 font-semibold">Product Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Product Collection</li>
                    <li>Product Collection</li>
                    <li>Product Collection</li>
                  </ul>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Product Collection</li>
                    <li>Product Collection</li>
                    <li>Product Collection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={closeModal}
          >
            ✖
          </button>
          <button
            className="absolute left-5 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              prevModalImage();
            }}
          >
            ◀
          </button>
          <img
            src={modalImages[currentModalIndex]}
            alt="Modal"
            className="max-h-[80vh] max-w-[80vw] object-contain"
          />
          <button
            className="absolute right-5 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              nextModalImage();
            }}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;

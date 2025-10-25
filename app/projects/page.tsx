'use client';
import { useState, useEffect } from 'react';

// Types
interface Project {
  project_id: number;
  project_name: string;
  data_update: string;
  project_category: 'Residential' | 'Commercial';
}

interface Product {
  collection_id: number;
  brand_id: number;
  project_id: number;
  brandname?: string;
  project_name?: string;
  main_type: string;
  type: string;
  detail: string;
  image: string;
  collection_link: string;
  status_discontinued: boolean;
  is_focus: boolean;
}

interface ProjectImage {
  image_id: number;
  project_id: number;
  image_url: string;
}

interface ProjectWithProducts extends Project {
  products: Product[];
  images: string[];
  mainImage: string;
}

const tabs = ['Residential', 'Commercial'];

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState<'Residential' | 'Commercial'>('Residential');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch projects
      const projectsResponse = await fetch('/api/projects');
      const projectsData = await projectsResponse.json();

      // Fetch products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();

      // Fetch project images
      const imagesResponse = await fetch('/api/project-images');
      const imagesData = await imagesResponse.json();

      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setProjectImages(Array.isArray(imagesData) ? imagesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProjects([]);
      setProducts([]);
      setProjectImages([]);
    }
    setLoading(false);
  };

  // Group products by project
  const getProjectsWithProducts = (): ProjectWithProducts[] => {
    return projects
      .filter(project => project.project_category === activeTab)
      .map(project => {
        const projectProducts = products.filter(p => p.project_id === project.project_id);

        // Get images from ProjectImage table
        const images = projectImages
          .filter(img => img.project_id === project.project_id)
          .sort((a, b) => a.image_id - b.image_id)
          .map(img => img.image_url);

        // Use first image from ProjectImage, or fallback to default
        const mainImage = images[0] || '/images/sample_project/sample_project.png';

        return {
          ...project,
          products: projectProducts,
          images: images,
          mainImage
        };
      })
      .filter(project => {
        if (!searchTerm) return true;
        return project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.products.some(p =>
            p.detail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.type?.toLowerCase().includes(searchTerm.toLowerCase())
          );
      });
  };

  const filteredProjects = getProjectsWithProducts();

  const openModal = (project: ProjectWithProducts) => {
    // Use images from projectimage table
    const images = project.images.length > 0
      ? project.images
      : [project.mainImage];

    setModalImages(images);
    setCurrentModalIndex(0);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const nextModalImage = () =>
    setCurrentModalIndex((prev) => (prev + 1) % modalImages.length);

  const prevModalImage = () =>
    setCurrentModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-[#2d2d2d] min-h-screen text-white px-4 py-8 pt-20">
      <p className="text-sm mb-4">
        We have a diverse body of work and utilize various materials.
      </p>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by Project or Collection Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-gray-700 text-white outline-none placeholder-gray-400"
        />
      </div>

      <button
        onClick={handleClearSearch}
        className="bg-gray-800 text-white px-4 py-2 rounded-full mb-6 hover:bg-gray-700 transition"
      >
        Clear All
      </button>

      <div className="flex space-x-12 mb-8 border-b border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-lg font-medium transition ${activeTab === tab
                ? 'border-b-4 border-white text-white'
                : 'text-gray-400 hover:text-gray-200'
              }`}
            onClick={() => setActiveTab(tab as 'Residential' | 'Commercial')}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span className="ml-4 text-lg">Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No projects found</p>
          {searchTerm && (
            <p className="text-sm mt-2">Try adjusting your search terms</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.project_id}
              className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <div
                className="relative h-60 cursor-pointer overflow-hidden"
                onClick={() => openModal(project)}
              >
                <img
                  src={project.mainImage}
                  alt={project.project_name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-lg font-medium">Click to View Gallery</span>
                </div>
                {project.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
                    {project.images.length} images
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{project.project_name}</h2>
                  <a
                    href={`/projectdetail?id=${project.project_id}`}
                    className="text-blue-600 text-sm hover:text-blue-800 transition"
                  >
                    Read Full
                  </a>
                </div>

                <div className="pl-4 pb-5">
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(project.data_update)}
                  </div>

                  {project.products.length > 0 && (
                    <>
                      <h3 className="mt-2 font-semibold">Product Overview</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                        <ul className="list-disc ml-5 space-y-1">
                          {project.products.slice(0, Math.min(4, Math.ceil(Math.min(8, project.products.length) / 2))).map((product) => (
                            <li key={product.collection_id} className="truncate" title={product.detail}>
                              {product.detail || product.type || 'Product'}
                            </li>
                          ))}
                        </ul>
                        {project.products.length > 1 && (
                          <ul className="list-disc ml-5 space-y-1">
                            {project.products.slice(Math.ceil(Math.min(8, project.products.length) / 2), Math.min(8, project.products.length)).map((product) => (
                              <li key={product.collection_id} className="truncate" title={product.detail}>
                                {product.detail || product.type || 'Product'}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {project.products.length > 8 && (
                        <div className="text-xs text-gray-500 mt-2 italic">
                          + {project.products.length - 8} more collections
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-3xl hover:text-gray-300 transition z-10"
            onClick={closeModal}
          >
            ✖
          </button>

          {modalImages.length > 1 && (
            <>
              <button
                className="absolute left-5 text-white text-4xl hover:text-gray-300 transition z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevModalImage();
                }}
              >
                ◀
              </button>
              <button
                className="absolute right-5 text-white text-4xl hover:text-gray-300 transition z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextModalImage();
                }}
              >
                ▶
              </button>
            </>
          )}

          <div className="relative max-h-[80vh] max-w-[80vw]">
            <img
              src={modalImages[currentModalIndex]}
              alt="Modal"
              className="max-h-[80vh] max-w-[80vw] object-contain"
            />
            {modalImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                {currentModalIndex + 1} / {modalImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
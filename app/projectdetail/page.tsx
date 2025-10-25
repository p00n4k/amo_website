'use client';
import { useState, useEffect } from 'react';

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: string;
}

interface Product {
    collection_id: number;
    brand_id: number;
    project_id: number;
    main_type: string;
    type: string;
    detail: string;
    image: string;
    collection_link: string;
    status_discontinued: number;
    is_focus: number;
    brandname: string;
    project_name: string;
}

interface ProjectImage {
    image_id: number;
    project_id: number;
    image_url: string;
}

export default function ProjectDetail() {
    const [current, setCurrent] = useState(0);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/projects');
                const data = await response.json();
                setProjects(data);
                if (data.length > 0) {
                    setSelectedProject(data[0]);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    // Fetch project images and products when project is selected
    useEffect(() => {
        if (!selectedProject) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch project images
                const imagesResponse = await fetch('http://localhost:3000/api/project-images');
                const allImages = await imagesResponse.json();
                const filteredImages = allImages.filter(
                    (img: ProjectImage) => img.project_id === selectedProject.project_id
                );
                setProjectImages(filteredImages);

                // Fetch products
                const productsResponse = await fetch('http://localhost:3000/api/products');
                const allProducts = await productsResponse.json();
                const filteredProds = allProducts.filter(
                    (prod: Product) => prod.project_id === selectedProject.project_id
                );
                setProducts(allProducts);
                setFilteredProducts(filteredProds);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProject]);

    const nextSlide = () => {
        setCurrent((current + 1) % projectImages.length);
    };

    const prevSlide = () => {
        setCurrent((current - 1 + projectImages.length) % projectImages.length);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (!selectedProject) {
        return (
            <div className="bg-[#4a4a4a] min-h-screen text-white flex items-center justify-center">
                <p className="text-xl">Loading projects...</p>
            </div>
        );
    }

    // Get 4 products at a time for carousel
    const carouselProducts = filteredProducts.slice(carouselIndex * 4, (carouselIndex * 4) + 4);
    const totalCarouselPages = Math.ceil(filteredProducts.length / 4);

    return (
        <div className="bg-[#4a4a4a] min-h-screen text-white">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between px-8 py-4 bg-[#3a3a3a]">
                <div className="flex items-center space-x-6">
                    <button className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium">
                        Back to Project
                    </button>
                    <span className="text-gray-300">Project</span>
                    <span className="text-gray-300">Menu</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">Amo</span>
                    <button className="px-1 py-1 bg-green-500 text-white text-xs rounded">TH</button>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
                        Get a quote
                    </button>
                </div>
            </div>

            <div className="px-8 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">About Project</h1>
                    <h2 className="text-xl mb-2">{selectedProject.project_name}</h2>
                    <div className="flex items-center text-sm text-gray-300">
                        <span>Updated: {formatDate(selectedProject.data_update)}</span>
                    </div>
                </div>

                {/* 🖼️ Image Slider - Centered */}
                {projectImages.length > 0 ? (
                    <div className="relative flex justify-center mb-12">
                        <div className="overflow-hidden rounded-lg shadow-lg w-full max-w-2xl">
                            <img
                                src={projectImages[current]?.image_url}
                                alt={`Slide ${current}`}
                                className="w-full h-64 object-cover mx-auto"
                            />
                        </div>

                        {/* Navigation Arrows */}
                        {projectImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-[calc(50%-580px)] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75"
                                >
                                    <span className="text-white text-2xl">‹</span>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-[calc(50%-580px)] top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75"
                                >
                                    <span className="text-white text-2xl">›</span>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full max-w-2xl mx-auto h-64 bg-gray-700 rounded-lg flex items-center justify-center mb-12">
                        <p className="text-gray-400">No images available</p>
                    </div>
                )}

                {/* Take a look here Section */}
                <div className="mb-12">
                    <h3 className="text-center text-xl mb-6">Take a look here</h3>

                    {/* Product Carousel */}
                    <div className="flex justify-center space-x-4 mb-4">
                        {carouselProducts.map((product) => (
                            <div
                                key={product.collection_id}
                                className="relative w-32 h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer"
                            >
                                <img
                                    src={product.image}
                                    alt={product.type}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold text-center px-1">
                                        {product.type.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Dots */}
                    {totalCarouselPages > 1 && (
                        <div className="flex justify-center space-x-2">
                            {Array.from({ length: totalCarouselPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCarouselIndex(idx)}
                                    className={`w-3 h-3 rounded-full border-2 border-orange-500 ${idx === carouselIndex ? 'bg-orange-500' : 'bg-transparent'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Overview Table */}
                <div className="bg-[#3a3a3a] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-500 p-2 rounded">
                                <span className="text-white text-xl">🎨</span>
                            </div>
                            <h2 className="text-xl font-semibold">Product Overview</h2>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-1 bg-white text-orange-500 rounded-full text-sm font-medium hover:bg-gray-100">
                                All Category
                            </button>
                            <button className="px-4 py-1 bg-white text-orange-500 rounded-full text-sm font-medium hover:bg-gray-100">
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-white text-sm">
                                <thead>
                                    <tr className="border-b border-gray-600">
                                        <th className="px-4 py-3 font-medium">Product Collection ↑</th>
                                        <th className="px-4 py-3 font-medium">Brand ↑</th>
                                        <th className="px-4 py-3 font-medium">Detail ↑</th>
                                        <th className="px-4 py-3 font-medium">Type ↑</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.collection_id} className="border-b border-gray-700">
                                            <td className="px-4 py-3">{product.type}</td>
                                            <td className="px-4 py-3">{product.brandname}</td>
                                            <td className="px-4 py-3">{product.detail}</td>
                                            <td className="px-4 py-3">{product.main_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No products found for this project</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

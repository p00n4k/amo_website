'use client';
import { useState, useEffect } from 'react';
import { LibraryBig } from "lucide-react";
import Link from 'next/link';

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
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/projects');
                const data = await response.json();
                setProjects(data);
                if (data.length > 0) setSelectedProject(data[0]);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProject) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const imagesResponse = await fetch('http://localhost:3000/api/project-images');
                const allImages = await imagesResponse.json();
                const filteredImages = allImages.filter(
                    (img: ProjectImage) => img.project_id === selectedProject.project_id
                );
                setProjectImages(filteredImages);

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

    useEffect(() => {
        if (!selectedType) {
            setFilteredProducts(products.filter(p => p.project_id === selectedProject?.project_id));
        } else {
            setFilteredProducts(
                products.filter(
                    p => p.project_id === selectedProject?.project_id && p.type === selectedType
                )
            );
        }
    }, [selectedType, products, selectedProject]);

    const nextSlide = () => setCurrent((current + 1) % projectImages.length);
    const prevSlide = () => setCurrent((current - 1 + projectImages.length) % projectImages.length);

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

    const carouselProducts = filteredProducts.slice(carouselIndex * 4, (carouselIndex * 4) + 4);
    const totalCarouselPages = Math.ceil(filteredProducts.length / 4);
    const uniqueTypes = Array.from(new Set(products.map(p => p.type))).sort();

    return (
        <div className="bg-[#4a4a4a] min-h-screen text-white">

            {/* ==================== HEADER + HERO ==================== */}
            <div className="relative bg-gradient-to-b from-[#3e3e3e] to-[#4a4a4a] text-white">
                {/* Header Bar */}
                <header className="flex items-center justify-between px-8 py-4 bg-transparent">
                    <div className="flex items-center space-x-8">
                        <Link href="/projects">
                            <button className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
                                Back to Project
                            </button>
                        </Link>

                        <nav className="flex items-center space-x-6 text-sm text-gray-300">
                            <a href="/product" className="hover:text-white transition">Product</a>
                            <a href="/home" className="hover:text-white transition">Home</a>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold tracking-wide">Amo</span>
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            LINE
                        </span>
                        <button className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-2 rounded-full font-medium">
                            Get in touch
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="px-12 pt-20 pb-16 text-left">
                    <h1 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-md">About Project</h1>
                    <h2 className="text-3xl font-semibold mb-4">{selectedProject.project_name}</h2>
                    <div className="flex items-center text-gray-300 text-lg space-x-4">
                        <span className="text-pink-500 text-2xl">📍</span>
                        <span>Location</span>
                        <span>•</span>
                        <span>Updated : {formatDate(selectedProject.data_update)}</span>
                    </div>
                </section>
            </div>

            <div className="px-8 py-8">
                {/* Image Slider */}
                {projectImages.length > 0 ? (
                    <div
                        className="relative w-full max-w-5xl mx-auto overflow-hidden mb-12 group"
                        onMouseEnter={() => clearInterval((window as any).sliderTimer)}
                        onMouseLeave={() => {
                            (window as any).sliderTimer = setInterval(() => {
                                setCurrent((prev) => (prev + 1) % projectImages.length);
                            }, 3000);
                        }}
                    >
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{
                                transform: `translateX(-${current * (100 / 2.2)}%)`,
                                width: `${projectImages.length * (100 / 2.2)}%`,
                            }}
                        >
                            {projectImages.concat(projectImages[0]).map((img, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 px-2"
                                    style={{ flexBasis: '45%' }}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={`Slide ${idx}`}
                                        className="rounded-2xl shadow-lg w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={prevSlide}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 
                            bg-black/0 text-white rounded-full w-10 h-10 
                            flex items-center justify-center opacity-0 
                            group-hover:opacity-100 group-hover:bg-black/40 
                            transition duration-300 hover:bg-black/60"
                        >
                            ‹
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                            bg-black/0 text-white rounded-full w-10 h-10 
                            flex items-center justify-center opacity-0 
                            group-hover:opacity-100 group-hover:bg-black/40 
                            transition duration-300 hover:bg-black/60"
                        >
                            ›
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl mx-auto h-64 bg-gray-700 rounded-lg flex items-center justify-center mb-12">
                        <p className="text-gray-400">No images available</p>
                    </div>
                )}

                {/* Carousel Section */}
                <div className="mb-12">
                    <h3 className="text-center text-xl mb-6">Take a look here</h3>
                    <div className="flex justify-center space-x-4 mb-4">
                        {carouselProducts.map(product => (
                            <a
                                key={product.collection_id}
                                href={product.collection_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-32 h-20 rounded-lg overflow-hidden shadow-lg cursor-pointer block"
                            >
                                <img
                                    src={product.image}
                                    alt={product.type}
                                    className="w-full h-full object-cover brightness-50 transition duration-300 hover:brightness-100"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold text-center px-1 drop-shadow-md">
                                        {product.type.toUpperCase()}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>

                    {totalCarouselPages > 1 && (
                        <div className="flex justify-center space-x-2">
                            {Array.from({ length: totalCarouselPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCarouselIndex(idx)}
                                    className={`w-3 h-3 rounded-full border-2 border-orange-500 ${idx === carouselIndex ? 'bg-orange-500' : 'bg-transparent'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Overview */}
                <div className="bg-[#3a3a3a] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-500 p-2 rounded">
                                <LibraryBig className="text-white w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-semibold">Product Overview</h2>
                        </div>

                        {/* Dropdown Filter */}
                        <div className="flex items-center gap-3 relative">
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full flex items-center gap-2 hover:bg-orange-500 hover:text-white transition bg-white"
                                >
                                    {selectedType ? selectedType : 'Select Type'}
                                    <span className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▲</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedType(null);
                                                setDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                                        >
                                            All Category
                                        </button>
                                        {uniqueTypes.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    setSelectedType(type);
                                                    setDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedType(null)}
                                className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full flex items-center gap-2 hover:bg-orange-500 hover:text-white transition bg-white"
                            >
                                Clear All ✕
                            </button>
                        </div>
                    </div>

                    {/* Product Table */}
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
                                    {filteredProducts.map(product => (
                                        <tr
                                            key={product.collection_id}
                                            onClick={() => window.open(product.collection_link, '_blank')}
                                            className="border-b border-gray-700 hover:bg-gray-700 transition cursor-pointer"
                                        >
                                            <td className="px-4 py-3">{product.type}</td>
                                            <td className="px-4 py-3">{product.brandname}</td>
                                            <td className="px-4 py-3">{product.detail}</td>
                                            <td className="px-4 py-3">{product.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No products found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Types
interface Brand {
    brand_id: number;
    brandname: string;
    main_type: string;
    type: string;
    image: string;
}

export default function ProductSearchPage() {
    const [activeMainType, setActiveMainType] = useState<'Surface' | 'Furniture'>('Surface');
    const [activeType, setActiveType] = useState<string>('ALL');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch brands data
    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/brands');
            if (response.ok) {
                const data = await response.json();
                setBrands(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
        setLoading(false);
    };

    // Get unique types for current main_type
    const getTypesForMainType = (mainType: string): string[] => {
        const types = brands
            .filter(b => b.main_type === mainType)
            .map(b => b.type)
            .filter((value, index, self) => self.indexOf(value) === index); // unique
        return types.sort();
    };

    // Filter brands based on selections
    const filteredBrands = brands.filter(brand => {
        const matchesMainType = brand.main_type === activeMainType;
        const matchesType = activeType === 'ALL' || brand.type === activeType;
        const matchesSearch = brand.brandname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMainType && matchesType && matchesSearch;
    });

    const availableTypes = getTypesForMainType(activeMainType);

    return (
        <div className="bg-[#3A3A3A] text-white min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-[#2E2E2E]">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-[#F5F5F5] text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition"
                    >
                        ← Back to Products
                    </button>
                    <nav className="flex space-x-6 text-sm">
                        <a href="/projects" className="hover:underline">Projects</a>
                        <a href="/" className="hover:underline">Home</a>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">Amo</span>
                    <button className="bg-[#FF7A00] px-4 py-2 rounded-md text-sm hover:bg-[#E66D00] transition">
                        Get in touch
                    </button>
                </div>
            </header>

            {/* Banner */}
            <div className="p-6">
                <div className="rounded-2xl overflow-hidden shadow-lg h-[200px] relative">
                    <Image
                        src="/images/banner.png"
                        alt="Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Main Type Tabs (Surface / Furnishing) */}
            <div className="flex justify-center space-x-8 border-b border-gray-600 px-6">
                <button
                    onClick={() => {
                        setActiveMainType('Surface');
                        setActiveType('ALL');
                    }}
                    className={`pb-2 border-b-2 transition-colors ${activeMainType === 'Surface'
                            ? 'border-white font-semibold'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                >
                    Surface
                </button>
                <button
                    onClick={() => {
                        setActiveMainType('Furniture');
                        setActiveType('ALL');
                    }}
                    className={`pb-2 border-b-2 transition-colors ${activeMainType === 'Furniture'
                            ? 'border-white font-semibold'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                >
                    Furnishing
                </button>
            </div>

            {/* Type Filter Buttons */}
            <div className="flex justify-center flex-wrap gap-3 mt-6 px-6">
                <button
                    onClick={() => setActiveType('ALL')}
                    className={`px-4 py-2 rounded-md transition-all ${activeType === 'ALL'
                            ? 'bg-[#FF7A00] text-white shadow-lg'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                >
                    ALL
                </button>
                {availableTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 rounded-md transition-all ${activeType === type
                                ? 'bg-[#FF7A00] text-white shadow-lg'
                                : 'bg-white text-black hover:bg-gray-200'
                            }`}
                    >
                        {type.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="px-6 mt-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search brands or types..."
                    className="w-full max-w-md mx-auto block bg-[#2E2E2E] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                />
            </div>

            {/* Title */}
            <div className="px-6 mt-8">
                <p className="text-sm text-gray-300">
                    Find the Right Brand from Our <span className="font-bold">{filteredBrands.length}</span> Selections
                </p>
                <h2 className="text-2xl font-bold mt-2">
                    {activeType === 'ALL' ? activeMainType.toUpperCase() : activeType.toUpperCase()}
                </h2>
            </div>

            {/* Brand Cards */}
            <div className="px-6 mt-6 pb-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No brands found</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBrands.map((brand) => (
                            <div
                                key={brand.brand_id}
                                className="bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                                onClick={() => {
                                    // Navigate to brand detail page or handle click
                                    console.log('Brand clicked:', brand.brandname);
                                    // window.location.href = `/brands/${brand.brand_id}`;
                                }}
                            >
                                <div className="relative h-48 bg-[#2E2E2E]">
                                    {brand.image ? (
                                        <Image
                                            src={brand.image}
                                            alt={brand.brandname}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-6xl">🏢</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex justify-between items-center bg-gradient-to-t from-[#3A3A3A] to-transparent">
                                    <div>
                                        <h3 className="font-semibold text-lg">{brand.brandname}</h3>
                                        <p className="text-sm text-gray-400">{brand.type}</p>
                                    </div>
                                    <span className="text-gray-400 group-hover:text-white transition-colors text-2xl">
                                        ↗
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
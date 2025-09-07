// app/page.tsxProductSearchPage
"use client";

import Image from "next/image";

export default function ProductSearchPage() {
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-gray-800">
                <div className="flex items-center space-x-4">
                    <button className="bg-gray-200 text-black px-3 py-1 rounded-md text-sm">
                        Back to Products
                    </button>
                    <nav className="flex space-x-6 text-sm">
                        <a href="#" className="hover:underline">
                            Projects
                        </a>
                        <a href="#" className="hover:underline">
                            Home
                        </a>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg">Amo</span>
                    <button className="bg-orange-500 px-3 py-1 rounded-md text-sm">
                        Get in touch
                    </button>
                </div>
            </header>

            {/* Banner */}
            <div className="p-6">
                <div className="rounded-2xl overflow-hidden shadow-lg max-h-[200px]">
                    <Image
                        src="/images/banner.png"
                        alt="Banner"
                        width={1200}
                        height={400}
                        className="w-full object-cover"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center space-x-8 border-b border-gray-700">
                <button className="pb-2 border-b-2 border-white">Surface</button>
                <button className="pb-2 text-gray-400">Furnishing</button>
            </div>

            {/* Filter buttons */}
            <div className="flex justify-center space-x-3 mt-6">
                <button className="bg-gray-700 px-3 py-1 rounded-md">TILE</button>
                <button className="bg-white text-black px-3 py-1 rounded-md">
                    MOSAIC & DECOR
                </button>
                <button className="bg-white text-black px-3 py-1 rounded-md">
                    MORE PRODUCTS
                </button>
            </div>

            {/* Title */}
            <div className="px-6 mt-8">
                <p className="text-sm text-gray-400">
                    Find the Right Brand from Our <span className="font-bold">120</span>{" "}
                    Selections
                </p>
                <h2 className="text-2xl font-bold mt-2">TILE</h2>
            </div>

            {/* Brand Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 mt-6 pb-12">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                    >
                        <Image
                            src="/images/01_pd_focus_atlasconcorde.jpg"
                            alt="Brand"
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 flex justify-between items-center">
                            <span>Brand Name</span>
                            <span className="text-gray-400">↗</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';

const images = [
    '/images/sample_project/Lemmy.jpg',
    '/images/sample_project/Lemmy.jpg',
    '/images/sample_project/Lemmy.jpg',
];

export default function ProjectDetail() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((current + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrent((current - 1 + images.length) % images.length);
    };

    return (
        <div className="bg-gray-700 min-h-screen text-white px-6 py-10 pt-50">
            {/* Header */}
            <h1 className="text-5xl font-bold mb-2">About Project</h1>
            <h2 className="text-2xl font-semibold mb-4">Project Name</h2>
            <div className="flex items-center text-sm mb-6">
                <span className="text-yellow-400 mr-2">📍 Location</span>
                <span>Updated: 25 Dec 2024</span>
            </div>

            {/* Image Slider */}
            <div className="relative w-full max-w-4xl mx-auto">
                <div className="overflow-hidden rounded-lg">
                    <img
                        src={images[current]}
                        alt={`Slide ${current}`}
                        className="w-full h-96 object-cover transition duration-500"
                    />
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
                >
                    ▶
                </button>
            </div>

            {/* Thumbnail Dots */}
            <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${index === current ? 'bg-white' : 'bg-gray-400'
                            }`}
                    ></button>
                ))}
            </div>
            {/* Description */}
            <div className="mt-12 text-center">
                <h2 className="text-white text-2xl font-semibold mb-6">Take a look here</h2>

                <div className="flex justify-center space-x-4 mb-6">
                    {['MARVEL', 'LOG', 'BOOST', '3DWALL'].map((title, index) => (
                        <div
                            key={index}
                            className="relative w-40 h-24 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                        >
                            <img
                                src={`/images/${title.toLowerCase()}.jpg`} // example: /images/marvel.jpg
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">{title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center space-x-4">
                    {[0, 1, 2, 3, 4].map((dot) => (
                        <span
                            key={dot}
                            className={`w-4 h-4 rounded-full border-2 ${dot === 0 ? 'bg-orange-500 border-orange-500' : 'border-orange-500'
                                }`}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-12 bg-[#2d2d2d] rounded-2xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="bg-orange-500 p-2 rounded">
                            <span className="text-white text-xl font-bold">🎨</span>
                        </div>
                        <h2 className="text-white text-2xl font-semibold">Product Overview</h2>
                    </div>
                    <div className="flex space-x-2">
                        <button className="flex items-center px-4 py-1 bg-white text-orange-500 rounded-full text-sm">
                            All Category <span className="ml-2">🎛</span>
                        </button>
                        <button className="flex items-center px-4 py-1 bg-white text-orange-500 rounded-full text-sm">
                            Clear All <span className="ml-2">❌</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-4 py-2">Product Collection ⬆</th>
                                <th className="px-4 py-2">Brand ⬆</th>
                                <th className="px-4 py-2">Detail ⬆</th>
                                <th className="px-4 py-2">Type ⬆</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <tr key={idx} className="border-t border-gray-600">
                                    <td className="px-4 py-2 font-semibold">Collection Name</td>
                                    <td className="px-4 py-2">Brand Name</td>
                                    <td className="px-4 py-2">Color Name</td>
                                    <td className="px-4 py-2">Type Name</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-6 space-x-4">
                    <button className="bg-orange-500 text-white px-6 py-2 rounded-full shadow">
                        Load More
                    </button>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-full shadow">
                        ⚙
                    </button>
                </div>
            </div>
            {/* Description */}
            <div className="mt-12 text-center">
                <h2 className="text-white text-2xl font-semibold mb-6">Take a look here</h2>

                <div className="flex justify-center space-x-4 mb-6">
                    {['MARVEL', 'LOG', 'BOOST', '3DWALL'].map((title, index) => (
                        <div
                            key={index}
                            className="relative w-40 h-24 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                        >
                            <img
                                src={`/images/${title.toLowerCase()}.jpg`} // example: /images/marvel.jpg
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">{title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center space-x-4">
                    {[0, 1, 2, 3, 4].map((dot) => (
                        <span
                            key={dot}
                            className={`w-4 h-4 rounded-full border-2 ${dot === 0 ? 'bg-orange-500 border-orange-500' : 'border-orange-500'
                                }`}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}

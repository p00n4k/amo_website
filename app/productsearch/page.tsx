'use client';
import { useState } from 'react';

const brands = [
    'Atlas Concorde',
    'Atlas Plan',
    'BluStyle',
    'Caesar',
    'Cotto D’Este',
    'Energiekar',
    'Keope',
    'Mirage',
    'Sant’Agostino',
    'Settecento',
];

const products = [
    { name: 'Piombo Roccia', brand: 'Atlas Concorde', image: '/images/productsearch/image-1.png' },
    { name: 'Platino Roccia', brand: 'Atlas Concorde', image: '/images/productsearch/image-2.png' },
    { name: 'Magnesio Roccia', brand: 'Atlas Concorde', image: '/images/productsearch/image.png' },
    // Add more product entries here...
];

export default function ProductSearchPage() {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    const toggleBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-800 text-white  pt-30">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-700 p-4">
                <h2 className="text-lg font-semibold mb-4">All Products</h2>

                <div>
                    <h3 className="text-sm font-semibold mb-2">Surface</h3>
                    <div className="ml-2">
                        <label className="flex items-center mb-1">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedBrands.length === 0}
                                onChange={() => setSelectedBrands([])}
                            />
                            Select All
                        </label>
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center mb-1">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2">Mosaic & Decoration</h3>
                    {/* Add more sections if needed */}
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2">More Products</h3>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="border-b border-gray-600 mb-4">
                    <div className="flex space-x-8">
                        <button className="pb-2 border-b-2 border-white">Surface</button>
                        <button className="pb-2 border-b-2 border-transparent">Furnishing</button>
                    </div>
                </div>

                <p className="text-sm mb-4">
                    Showing <strong>50</strong> results from a total of <strong>120</strong> for “Surface”
                </p>

                <h1 className="text-xl font-semibold mb-4">Tile</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.name} className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
                            <div className="h-40 bg-gray-600">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-base font-semibold">{product.name}</h2>
                                <p className="text-sm text-gray-300">{product.brand}</p>
                                <button className="mt-2 p-2 rounded-full bg-gray-600 hover:bg-gray-500">
                                    →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    Upload,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    LogOut,
    Search,
    Image as ImageIcon,
    Package
} from 'lucide-react';
import ProjectImageManager from '@/Components/ProjectImageManager';
import ProjectCollectionManager from '@/Components/ProjectCollectionManager';

interface Brand {
    brand_id: number;
    brandname: string;
    main_type: string;
    type: string;
    image: string;
}

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: 'Residential' | 'Commercial';
}

interface ProductCollection {
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
}

export default function AdminDashboard() {
    // Authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Tabs
    const [activeTab, setActiveTab] = useState<'brands' | 'projects' | 'products'>('brands');
    const [searchTerm, setSearchTerm] = useState('');

    // Data
    const [brands, setBrands] = useState<Brand[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [products, setProducts] = useState<ProductCollection[]>([]);

    // Modals
    const [showImageManager, setShowImageManager] = useState(false);
    const [showCollectionManager, setShowCollectionManager] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // Fetch data
    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();
    }, [isAuthenticated, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'brands') {
                const res = await fetch('/api/brands');
                const data = await res.json();
                setBrands(data);
            } else if (activeTab === 'projects') {
                const res = await fetch('/api/projects');
                const data = await res.json();
                setProjects(data);
            } else if (activeTab === 'products') {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleLogin = () => {
        if (password === 'amo_admin') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
    };

    // Delete handler example
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        let endpoint = '';
        if (activeTab === 'brands') endpoint = `/api/brands/${id}`;
        if (activeTab === 'projects') endpoint = `/api/projects/${id}`;
        if (activeTab === 'products') endpoint = `/api/products/${id}`;
        try {
            await fetch(endpoint, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    // Columns
    const brandColumns = [
        { key: 'brand_id', label: 'ID' },
        { key: 'brandname', label: 'ชื่อแบรนด์' },
        { key: 'main_type', label: 'ประเภทหลัก' },
        { key: 'type', label: 'ชนิด' },
        { key: 'image', label: 'รูปภาพ' },
        { key: 'actions', label: 'จัดการ' }
    ];

    const projectColumns = [
        { key: 'project_id', label: 'ID' },
        { key: 'project_name', label: 'ชื่อโปรเจกต์' },
        { key: 'data_update', label: 'วันที่อัปเดต' },
        { key: 'project_category', label: 'ประเภท' },
        { key: 'actions', label: 'จัดการ' }
    ];

    const productColumns = [
        { key: 'collection_id', label: 'ID' },
        { key: 'main_type', label: 'Main Type' },
        { key: 'type', label: 'Type' },
        { key: 'detail', label: 'รายละเอียด' },
        { key: 'image', label: 'รูปภาพ' },
        { key: 'actions', label: 'จัดการ' }
    ];

    // Filter data by search term
    const filteredData =
        activeTab === 'brands'
            ? brands.filter(b => b.brandname.toLowerCase().includes(searchTerm.toLowerCase()))
            : activeTab === 'projects'
                ? projects.filter(p => p.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
                : products.filter(p => p.detail.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center">
                    <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full border rounded-md px-3 py-2 mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleLogin}
                        className="bg-black text-white px-4 py-2 rounded-md w-full hover:bg-gray-800 transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex justify-between items-center bg-black text-white px-6 py-3">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        className="px-3 py-1 rounded text-black"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleLogout} className="flex items-center gap-1 text-sm">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <nav className="flex gap-4 bg-gray-200 px-6 py-3">
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`${activeTab === 'brands' ? 'bg-black text-white' : 'bg-white text-black'} px-4 py-2 rounded`}
                >
                    Brands
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`${activeTab === 'projects' ? 'bg-black text-white' : 'bg-white text-black'} px-4 py-2 rounded`}
                >
                    Projects
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`${activeTab === 'products' ? 'bg-black text-white' : 'bg-white text-black'} px-4 py-2 rounded`}
                >
                    Products
                </button>
            </nav>

            {/* Tables */}
            <div className="p-6">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            {(activeTab === 'brands'
                                ? brandColumns
                                : activeTab === 'projects'
                                    ? projectColumns
                                    : productColumns
                            ).map((col) => (
                                <th key={col.key} className="text-left px-4 py-2 border-b">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50 transition">
                                {(activeTab === 'brands'
                                    ? brandColumns
                                    : activeTab === 'projects'
                                        ? projectColumns
                                        : productColumns
                                ).map((col) => (
                                    <td key={col.key} className="px-4 py-3 border-b text-sm text-gray-800">
                                        {col.key === 'actions' ? (
                                            <div className="flex gap-2">
                                                {activeTab === 'projects' && (
                                                    <>
                                                        {/* Manage images */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProjectId(item.project_id);
                                                                setShowImageManager(true);
                                                            }}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                                                        >
                                                            <ImageIcon size={16} />
                                                        </button>

                                                        {/* Manage collections */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProjectId(item.project_id);
                                                                setShowCollectionManager(true);
                                                            }}
                                                            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"
                                                        >
                                                            <Package size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(item[Object.keys(item)[0]])}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : col.key === 'image' ? (
                                            <img
                                                src={item[col.key]}
                                                alt="thumb"
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            item[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modals */}
            {showImageManager && selectedProjectId && (
                <ProjectImageManager
                    projectId={selectedProjectId}
                    onClose={() => {
                        setShowImageManager(false);
                        setSelectedProjectId(null);
                    }}
                />
            )}

            {showCollectionManager && selectedProjectId && (
                <ProjectCollectionManager
                    projectId={selectedProjectId}
                    onClose={() => {
                        setShowCollectionManager(false);
                        setSelectedProjectId(null);
                    }}
                />
            )}
        </div>
    );
}

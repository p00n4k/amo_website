'use client';

import React, { useState, useEffect } from 'react';
import {
    Trash2,
    LogOut,
    Image as ImageIcon,
    Package,
    Plus,
    Upload,
} from 'lucide-react';
import ProjectImageManager from '@/Components/ProjectImageManager';
import ProjectCollectionManager from '@/Components/ProjectCollectionManager';
import HomeImageManager from '@/Components/HomeImageManager';

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
    project_category: string;
}

interface Product {
    collection_id: number;
    brand_id: number;
    main_type: string;
    type: string;
    detail: string;
    image: string;
    collection_link: string;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'brands' | 'projects' | 'products' | 'home'>('brands');
    const [searchTerm, setSearchTerm] = useState('');

    const [brands, setBrands] = useState<Brand[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const [showImageManager, setShowImageManager] = useState(false);
    const [showCollectionManager, setShowCollectionManager] = useState(false);

    // ✅ เพิ่ม Product Modal
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        brand_id: '',
        main_type: '',
        type: '',
        detail: '',
        collection_link: '',
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // ==============================
    // 🔹 Login System
    // ==============================
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

    // ==============================
    // 🔹 Fetch Data by Tab
    // ==============================
    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();
    }, [isAuthenticated, activeTab]);

    const fetchData = async () => {
        try {
            let res, data;
            if (activeTab === 'brands') {
                res = await fetch('/api/brands');
                data = await res.json();
                setBrands(Array.isArray(data) ? data : []);
            } else if (activeTab === 'projects') {
                res = await fetch('/api/projects');
                data = await res.json();
                setProjects(Array.isArray(data) ? data : []);
            } else if (activeTab === 'products') {
                res = await fetch('/api/products');
                data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    // ==============================
    // 🔹 Delete
    // ==============================
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

    // ==============================
    // 🔹 Add New Product
    // ==============================
    const handleAddProduct = async () => {
        try {
            setUploading(true);
            let imageUrl = '';

            // อัปโหลดรูปก่อน
            if (uploadFile) {
                const formData = new FormData();
                formData.append('file', uploadFile);
                const uploadRes = await fetch('/api/products/upload', {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok) imageUrl = uploadData.image_url;
            }

            // บันทึกสินค้า
            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newProduct, image: imageUrl }),
            });

            alert('เพิ่มสินค้าเรียบร้อย ✅');
            setShowAddProduct(false);
            setUploadFile(null);
            setNewProduct({
                brand_id: '',
                main_type: '',
                type: '',
                detail: '',
                collection_link: '',
            });
            fetchData();
        } catch (err) {
            console.error('Add product failed:', err);
            alert('เพิ่มสินค้าไม่สำเร็จ');
        } finally {
            setUploading(false);
        }
    };

    // ==============================
    // 🔹 UI - Login Page
    // ==============================
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

    // ==============================
    // 🔹 Table Header
    // ==============================
    const renderTableHeader = () => {
        if (activeTab === 'brands') {
            return ['ID', 'ชื่อแบรนด์', 'ประเภทหลัก', 'ชนิด', 'รูปภาพ', 'จัดการ'];
        }
        if (activeTab === 'projects') {
            return ['ID', 'ชื่อโปรเจกต์', 'วันที่อัปเดต', 'ประเภท', 'จัดการ'];
        }
        if (activeTab === 'products') {
            return ['ID', 'Main Type', 'Type', 'รายละเอียด', 'รูปภาพ', 'จัดการ'];
        }
    };

    const filteredData =
        activeTab === 'brands'
            ? brands.filter((b) => b.brandname?.toLowerCase().includes(searchTerm.toLowerCase()))
            : activeTab === 'projects'
                ? projects.filter((p) => p.project_name?.toLowerCase().includes(searchTerm.toLowerCase()))
                : products.filter((p) => p.type?.toLowerCase().includes(searchTerm.toLowerCase()));

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <div className="min-h-screen bg-gray-50">
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

            <nav className="flex gap-4 bg-gray-200 px-6 py-3">
                {['brands', 'projects', 'products', 'home'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`${activeTab === tab ? 'bg-black text-white' : 'bg-white text-black'
                            } px-4 py-2 rounded`}
                    >
                        {tab === 'brands'
                            ? 'Brands'
                            : tab === 'projects'
                                ? 'Projects'
                                : tab === 'products'
                                    ? 'Products'
                                    : 'Home Images'}
                    </button>
                ))}
            </nav>

            {/* ======================== */}
            {/* Tab: Home Images */}
            {/* ======================== */}
            {activeTab === 'home' ? (
                <div className="p-6">
                    <HomeImageManager />
                </div>
            ) : (
                <div className="p-6">
                    {/* Add Product Button */}
                    {activeTab === 'products' && (
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setShowAddProduct(true)}
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                            >
                                <Plus size={18} /> เพิ่มสินค้าใหม่
                            </button>
                        </div>
                    )}

                    {filteredData.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">ไม่มีข้อมูลในหมวดนี้</p>
                    ) : (
                        <table className="min-w-full bg-white border rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    {renderTableHeader()?.map((label, idx) => (
                                        <th key={idx} className="text-left px-4 py-2 border-b">
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        {activeTab === 'brands' && (
                                            <>
                                                <td className="px-4 py-2">{item.brand_id}</td>
                                                <td>{item.brandname}</td>
                                                <td>{item.main_type}</td>
                                                <td>{item.type}</td>
                                                <td>
                                                    <img src={item.image} className="w-12 h-12 rounded object-cover" />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(item.brand_id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'projects' && (
                                            <>
                                                <td>{item.project_id}</td>
                                                <td>{item.project_name}</td>
                                                <td>{item.data_update}</td>
                                                <td>{item.project_category}</td>
                                                <td className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProjectId(item.project_id);
                                                            setShowImageManager(true);
                                                        }}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                                                    >
                                                        <ImageIcon size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProjectId(item.project_id);
                                                            setShowCollectionManager(true);
                                                        }}
                                                        className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"
                                                    >
                                                        <Package size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.project_id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'products' && (
                                            <>
                                                <td>{item.collection_id}</td>
                                                <td>{item.main_type}</td>
                                                <td>{item.type}</td>
                                                <td>{item.detail}</td>
                                                <td>
                                                    <img src={item.image} className="w-12 h-12 rounded object-cover" />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(item.collection_id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ======================== */}
            {/* Modals */}
            {/* ======================== */}
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

            {/* Modal: Add Product */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl relative">
                        <button
                            onClick={() => setShowAddProduct(false)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold mb-4">เพิ่มสินค้าใหม่</h2>
                        <div className="space-y-3">
                            <input
                                placeholder="Brand ID"
                                className="w-full border p-2 rounded"
                                value={newProduct.brand_id}
                                onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })}
                            />
                            <input
                                placeholder="Main Type"
                                className="w-full border p-2 rounded"
                                value={newProduct.main_type}
                                onChange={(e) => setNewProduct({ ...newProduct, main_type: e.target.value })}
                            />
                            <input
                                placeholder="Type"
                                className="w-full border p-2 rounded"
                                value={newProduct.type}
                                onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                            />
                            <textarea
                                placeholder="Detail"
                                className="w-full border p-2 rounded"
                                value={newProduct.detail}
                                onChange={(e) => setNewProduct({ ...newProduct, detail: e.target.value })}
                            />
                            <input
                                placeholder="Link"
                                className="w-full border p-2 rounded"
                                value={newProduct.collection_link}
                                onChange={(e) => setNewProduct({ ...newProduct, collection_link: e.target.value })}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            />
                            <button
                                onClick={handleAddProduct}
                                disabled={uploading}
                                className={`w-full py-2 rounded-md text-white ${uploading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                                    }`}
                            >
                                {uploading ? 'Uploading...' : 'บันทึกสินค้า'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

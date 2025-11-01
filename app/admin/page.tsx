// ============================================
// 📁 File: app/admin/page.tsx
// ============================================
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit2, Trash2, Save, X, LogOut, Search, Image as ImageIcon, Star } from 'lucide-react';

// Types
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

interface FocusRound {
    round_id: number;
    round_name: string;
    update_date: string;
    note: string;
}

interface FocusSelection {
    surface_products: number[]; // collection_ids
    furniture_products: number[]; // collection_ids
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('brands');
    const [searchTerm, setSearchTerm] = useState('');

    const [brands, setBrands] = useState<Brand[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [focusRounds, setFocusRounds] = useState<FocusRound[]>([]);

    // State for Product Focus
    const [focusSelection, setFocusSelection] = useState<FocusSelection>({
        surface_products: [],
        furniture_products: []
    });
    const [focusSearchSurface, setFocusSearchSurface] = useState('');
    const [focusSearchFurniture, setFocusSearchFurniture] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && activeTab) {
            fetchData();
        }
    }, [activeTab, isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'brands': endpoint = '/api/brands'; break;
                case 'projects': endpoint = '/api/projects'; break;
                case 'products': endpoint = '/api/products'; break;
                case 'focus': endpoint = '/api/focus-rounds'; break;
                case 'productfocus':
                    endpoint = '/api/products';
                    break;
                default:
                    setLoading(false);
                    return;
            }

            if (!endpoint) {
                setLoading(false);
                return;
            }

            console.log('Fetching from:', endpoint);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                switch (activeTab) {
                    case 'brands': setBrands([]); break;
                    case 'projects': setProjects([]); break;
                    case 'products':
                    case 'productfocus':
                        setProducts([]);
                        break;
                    case 'focus': setFocusRounds([]); break;
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Data received:', data);

            switch (activeTab) {
                case 'brands': setBrands(Array.isArray(data) ? data : []); break;
                case 'projects': setProjects(Array.isArray(data) ? data : []); break;
                case 'products':
                case 'productfocus':
                    setProducts(Array.isArray(data) ? data : []);
                    // Populate focus selection from is_focus field
                    if (activeTab === 'productfocus' && Array.isArray(data)) {
                        const focusProducts = data.filter((p: Product) => p.is_focus);
                        setFocusSelection({
                            surface_products: focusProducts
                                .filter((p: Product) => p.main_type === 'Surface')
                                .map((p: Product) => p.collection_id),
                            furniture_products: focusProducts
                                .filter((p: Product) => p.main_type === 'Furniture')
                                .map((p: Product) => p.collection_id)
                        });
                    }
                    break;
                case 'focus': setFocusRounds(Array.isArray(data) ? data : []); break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            switch (activeTab) {
                case 'brands': setBrands([]); break;
                case 'projects': setProjects([]); break;
                case 'products':
                case 'productfocus':
                    setProducts([]);
                    break;
                case 'focus': setFocusRounds([]); break;
            }
        }
        setLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Superadmin123') {
            setIsAuthenticated(true);
            setPassword('');
        } else {
            alert('รหัสผ่านไม่ถูกต้อง!');
            setPassword('');
        }
    };

    const handleImageUpload = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
            return null;
        }
    };

    const handleCreate = async (formData: any) => {
        setLoading(true);
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'brands': endpoint = '/api/brands'; break;
                case 'projects': endpoint = '/api/projects'; break;
                case 'products': endpoint = '/api/products'; break;
                case 'focus': endpoint = '/api/focus-rounds'; break;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('เพิ่มข้อมูลสำเร็จ!');
                setShowForm(false);
                setEditingItem(null);
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
            }
        } catch (error) {
            console.error('Error creating:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    const handleUpdate = async (formData: any) => {
        setLoading(true);
        try {
            let endpoint = '';
            let idKey = '';

            switch (activeTab) {
                case 'brands':
                    endpoint = '/api/brands';
                    idKey = 'brand_id';
                    break;
                case 'projects':
                    endpoint = '/api/projects';
                    idKey = 'project_id';
                    break;
                case 'products':
                    endpoint = '/api/products';
                    idKey = 'collection_id';
                    break;
                case 'focus':
                    endpoint = '/api/focus-rounds';
                    idKey = 'round_id';
                    break;
            }

            const response = await fetch(`${endpoint}/${formData[idKey]}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('แก้ไขข้อมูลสำเร็จ!');
                setShowForm(false);
                setEditingItem(null);
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
            }
        } catch (error) {
            console.error('Error updating:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) return;

        setLoading(true);
        try {
            let endpoint = '';
            switch (activeTab) {
                case 'brands': endpoint = `/api/brands/${id}`; break;
                case 'projects': endpoint = `/api/projects/${id}`; break;
                case 'products': endpoint = `/api/products/${id}`; break;
                case 'focus': endpoint = `/api/focus-rounds/${id}`; break;
            }

            const response = await fetch(endpoint, { method: 'DELETE' });

            if (response.ok) {
                alert('ลบข้อมูลสำเร็จ!');
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    // Handle Product Focus Selection
    const handleToggleProduct = (collectionId: number, type: 'surface' | 'furniture') => {
        const key = type === 'surface' ? 'surface_products' : 'furniture_products';
        const currentSelection = focusSelection[key];
        const maxSelection = 4;

        if (currentSelection.includes(collectionId)) {
            // Remove from selection
            setFocusSelection({
                ...focusSelection,
                [key]: currentSelection.filter(id => id !== collectionId)
            });
        } else {
            // Add to selection (if not exceeding max)
            if (currentSelection.length < maxSelection) {
                setFocusSelection({
                    ...focusSelection,
                    [key]: [...currentSelection, collectionId]
                });
            } else {
                alert(`สามารถเลือกได้สูงสุด ${maxSelection} รายการเท่านั้น`);
            }
        }
    };

    const handleSaveFocusSelection = async () => {
        if (focusSelection.surface_products.length !== 4) {
            alert('กรุณาเลือก Surface ให้ครบ 4 รายการ');
            return;
        }
        if (focusSelection.furniture_products.length !== 4) {
            alert('กรุณาเลือก Furniture ให้ครบ 4 รายการ');
            return;
        }

        setLoading(true);
        try {
            const allSelectedIds = [
                ...focusSelection.surface_products,
                ...focusSelection.furniture_products
            ];

            // Update all products: set is_focus = true for selected, false for others
            const updatePromises = products.map(async (product) => {
                const shouldBeFocus = allSelectedIds.includes(product.collection_id);

                // Only update if the focus status is changing
                if (product.is_focus !== shouldBeFocus) {
                    const response = await fetch(`/api/products/${product.collection_id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...product,
                            is_focus: shouldBeFocus
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to update product ${product.collection_id}`);
                    }
                }
            });

            await Promise.all(updatePromises);

            alert('บันทึก Product Focus สำเร็จ!');
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error saving focus selection:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        }
        setLoading(false);
    };

    // Brand Form Component
    const BrandForm = () => {
        const [formData, setFormData] = useState({
            brand_id: editingItem?.brand_id || 0,
            brandname: editingItem?.brandname || '',
            main_type: editingItem?.main_type || '',
            type: editingItem?.type || '',
            image: editingItem?.image || ''
        });

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (editingItem) {
                await handleUpdate(formData);
            } else {
                await handleCreate(formData);
            }
        };

        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingItem ? '✏️ แก้ไขแบรนด์' : '➕ เพิ่มแบรนด์ใหม่'}
                    </h2>
                    <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ชื่อแบรนด์</label>
                        <input type="text" required value={formData.brandname} onChange={(e) => setFormData({ ...formData, brandname: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ประเภทหลัก</label>
                        <select required value={formData.main_type} onChange={(e) => setFormData({ ...formData, main_type: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">เลือกประเภทหลัก</option>
                            <option value="Surface">Surface</option>
                            <option value="Furniture">Furniture</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ประเภทย่อย</label>
                        <input type="text" required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">รูปภาพ (URL)</label>
                        <div className="flex gap-2">
                            <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://..." />
                            <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition">
                                <Upload size={20} />
                                อัปโหลด
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await handleImageUpload(file);
                                        if (url) setFormData({ ...formData, image: url });
                                    }
                                }} />
                            </label>
                        </div>
                        {formData.image && (
                            <div className="mt-3">
                                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center justify-center gap-2">
                            <Save size={20} />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition">
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // Project Form Component
    const ProjectForm = () => {
        const [formData, setFormData] = useState({
            project_id: editingItem?.project_id || 0,
            project_name: editingItem?.project_name || '',
            data_update: editingItem?.data_update || new Date().toISOString().split('T')[0],
            project_category: editingItem?.project_category || 'Residential'
        });

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (editingItem) {
                await handleUpdate(formData);
            } else {
                await handleCreate(formData);
            }
        };

        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingItem ? '✏️ แก้ไขโปรเจกต์' : '➕ เพิ่มโปรเจกต์ใหม่'}
                    </h2>
                    <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ชื่อโปรเจกต์</label>
                        <input type="text" required value={formData.project_name} onChange={(e) => setFormData({ ...formData, project_name: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ประเภทโปรเจกต์</label>
                        <select required value={formData.project_category} onChange={(e) => setFormData({ ...formData, project_category: e.target.value as 'Residential' | 'Commercial' })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="Residential">Residential (บ้านพักอาศัย)</option>
                            <option value="Commercial">Commercial (พาณิชย์)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">วันที่อัปเดต</label>
                        <input type="date" required value={formData.data_update} onChange={(e) => setFormData({ ...formData, data_update: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center justify-center gap-2">
                            <Save size={20} />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition">
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // Product Form Component
    const ProductForm = () => {
        const [formData, setFormData] = useState({
            collection_id: editingItem?.collection_id || 0,
            brand_id: editingItem?.brand_id || 0,
            project_id: editingItem?.project_id || 0,
            main_type: editingItem?.main_type || '',
            type: editingItem?.type || '',
            detail: editingItem?.detail || '',
            image: editingItem?.image || '',
            collection_link: editingItem?.collection_link || '',
            status_discontinued: editingItem?.status_discontinued || false,
            is_focus: editingItem?.is_focus || false
        });

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (editingItem) {
                await handleUpdate(formData);
            } else {
                await handleCreate(formData);
            }
        };

        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingItem ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}
                    </h2>
                    <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">แบรนด์</label>
                            <select required value={formData.brand_id} onChange={(e) => setFormData({ ...formData, brand_id: parseInt(e.target.value) })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value={0}>เลือกแบรนด์</option>
                                {brands.map(brand => (
                                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brandname}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">โปรเจกต์</label>
                            <select required value={formData.project_id} onChange={(e) => setFormData({ ...formData, project_id: parseInt(e.target.value) })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value={0}>เลือกโปรเจกต์</option>
                                {projects.map(project => (
                                    <option key={project.project_id} value={project.project_id}>{project.project_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">ประเภทหลัก</label>
                            <select required value={formData.main_type} onChange={(e) => setFormData({ ...formData, main_type: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">เลือกประเภทหลัก</option>
                                <option value="Surface">Surface</option>
                                <option value="Furniture">Furniture</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">ประเภทย่อย</label>
                            <input type="text" required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">รายละเอียด</label>
                        <textarea value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">รูปภาพ (URL)</label>
                        <div className="flex gap-2">
                            <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://..." />
                            <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition">
                                <Upload size={20} />
                                อัปโหลด
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await handleImageUpload(file);
                                        if (url) setFormData({ ...formData, image: url });
                                    }
                                }} />
                            </label>
                        </div>
                        {formData.image && (
                            <div className="mt-3">
                                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ลิงก์คอลเล็กชัน</label>
                        <input type="url" value={formData.collection_link} onChange={(e) => setFormData({ ...formData, collection_link: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://..." />
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.status_discontinued} onChange={(e) => setFormData({ ...formData, status_discontinued: e.target.checked })} className="w-5 h-5 text-red-600" />
                            <span className="text-gray-700">สินค้าหมดแล้ว (Discontinued)</span>
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center justify-center gap-2">
                            <Save size={20} />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="px-6 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition">
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // Product Focus Selection Component
    const ProductFocusSelection = () => {
        const surfaceProducts = products.filter(p => p.main_type === 'Surface' && !p.status_discontinued);
        const furnitureProducts = products.filter(p => p.main_type === 'Furniture' && !p.status_discontinued);

        const filteredSurfaceProducts = surfaceProducts.filter(p =>
            p.brandname?.toLowerCase().includes(focusSearchSurface.toLowerCase()) ||
            p.type?.toLowerCase().includes(focusSearchSurface.toLowerCase()) ||
            p.detail?.toLowerCase().includes(focusSearchSurface.toLowerCase())
        );

        const filteredFurnitureProducts = furnitureProducts.filter(p =>
            p.brandname?.toLowerCase().includes(focusSearchFurniture.toLowerCase()) ||
            p.type?.toLowerCase().includes(focusSearchFurniture.toLowerCase()) ||
            p.detail?.toLowerCase().includes(focusSearchFurniture.toLowerCase())
        );

        const renderProductCard = (product: Product, type: 'surface' | 'furniture') => {
            const isSelected = type === 'surface'
                ? focusSelection.surface_products.includes(product.collection_id)
                : focusSelection.furniture_products.includes(product.collection_id);

            return (
                <div
                    key={product.collection_id}
                    onClick={() => handleToggleProduct(product.collection_id, type)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${isSelected
                        ? 'ring-4 ring-yellow-400 shadow-xl scale-105'
                        : 'hover:shadow-lg hover:scale-102 border-2 border-gray-200'
                        }`}
                >
                    {isSelected && (
                        <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-white rounded-full p-2 shadow-lg">
                            <Star size={20} fill="currentColor" />
                        </div>
                    )}
                    <div className="aspect-square bg-gray-100">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.detail}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={48} className="text-gray-300" />
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-white">
                        <h3 className="font-semibold text-gray-800 truncate">{product.brandname}</h3>
                        <p className="text-sm text-gray-600 truncate">{product.type}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{product.detail}</p>
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-8">
                {/* Save Button */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">🌟 Product Focus Selection</h2>
                            <p className="text-gray-600 mt-1">
                                เลือก Surface {focusSelection.surface_products.length}/4 |
                                Furniture {focusSelection.furniture_products.length}/4
                            </p>
                        </div>
                        <button
                            onClick={handleSaveFocusSelection}
                            disabled={loading || focusSelection.surface_products.length !== 4 || focusSelection.furniture_products.length !== 4}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center gap-2 shadow-lg"
                        >
                            <Save size={20} />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกการเลือก'}
                        </button>
                    </div>
                </div>

                {/* Surface Products */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            🏔️ Surface Products ({focusSelection.surface_products.length}/4)
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={focusSearchSurface}
                                onChange={(e) => setFocusSearchSurface(e.target.value)}
                                placeholder="ค้นหา Surface..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredSurfaceProducts.map(product => renderProductCard(product, 'surface'))}
                    </div>
                    {filteredSurfaceProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            ไม่พบสินค้า Surface
                        </div>
                    )}
                </div>

                {/* Furniture Products */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            🪑 Furniture Products ({focusSelection.furniture_products.length}/4)
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={focusSearchFurniture}
                                onChange={(e) => setFocusSearchFurniture(e.target.value)}
                                placeholder="ค้นหา Furniture..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredFurnitureProducts.map(product => renderProductCard(product, 'furniture'))}
                    </div>
                    {filteredFurnitureProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            ไม่พบสินค้า Furniture
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Data Table Component
    const DataTable = () => {
        if (activeTab === 'productfocus') {
            return <ProductFocusSelection />;
        }

        let data: any[] = [];
        let columns: { key: string; label: string }[] = [];
        let idKey = '';

        switch (activeTab) {
            case 'brands':
                data = brands;
                columns = [
                    { key: 'brand_id', label: 'ID' },
                    { key: 'brandname', label: 'ชื่อแบรนด์' },
                    { key: 'main_type', label: 'ประเภทหลัก' },
                    { key: 'type', label: 'ประเภทย่อย' },
                    { key: 'image', label: 'รูปภาพ' }
                ];
                idKey = 'brand_id';
                break;
            case 'projects':
                data = projects;
                columns = [
                    { key: 'project_id', label: 'ID' },
                    { key: 'project_name', label: 'ชื่อโปรเจกต์' },
                    { key: 'project_category', label: 'ประเภท' },
                    { key: 'data_update', label: 'วันที่อัปเดต' }
                ];
                idKey = 'project_id';
                break;
            case 'products':
                data = products;
                columns = [
                    { key: 'collection_id', label: 'ID' },
                    { key: 'brandname', label: 'แบรนด์' },
                    { key: 'project_name', label: 'โปรเจกต์' },
                    { key: 'main_type', label: 'ประเภทหลัก' },
                    { key: 'type', label: 'ประเภทย่อย' },
                    { key: 'detail', label: 'รายละเอียด' },
                    { key: 'image', label: 'รูปภาพ' },
                    { key: 'status_discontinued', label: 'สถานะ' }
                ];
                idKey = 'collection_id';
                break;
            case 'focus':
                data = focusRounds;
                columns = [
                    { key: 'round_id', label: 'ID' },
                    { key: 'round_name', label: 'ชื่อรอบ' },
                    { key: 'update_date', label: 'วันที่อัปเดต' },
                    { key: 'note', label: 'หมายเหตุ' }
                ];
                idKey = 'round_id';
                break;
        }

        // Filter data based on search
        const filteredData = data.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchLower)
            );
        });

        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} className="px-6 py-4 text-left text-sm font-semibold">{col.label}</th>
                                ))}
                                <th className="px-6 py-4 text-right text-sm font-semibold">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span>กำลังโหลดข้อมูล...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={item[idKey]} className={`hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        {columns.map(col => (
                                            <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                                                {col.key === 'image' ? (
                                                    item[col.key] ? (
                                                        <img src={item[col.key]} alt="Preview" className="w-16 h-16 object-cover rounded-lg shadow" />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <ImageIcon size={24} className="text-gray-400" />
                                                        </div>
                                                    )
                                                ) : col.key === 'status_discontinued' ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item[col.key] ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {item[col.key] ? 'หมดแล้ว' : 'มีจำหน่าย'}
                                                    </span>
                                                ) : col.key === 'is_focus' ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item[col.key] ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {item[col.key] ? '⭐ Focus' : 'ปกติ'}
                                                    </span>
                                                ) : col.key === 'project_category' ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item[col.key] === 'Commercial' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                                        {item[col.key] === 'Commercial' ? '🏢 Commercial' : '🏠 Residential'}
                                                    </span>
                                                ) : (
                                                    String(item[col.key] || '-')
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingItem(item); setShowForm(true); }}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    title="แก้ไข"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item[idKey])}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                    title="ลบ"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🔐</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
                        <p className="text-gray-600">ระบบจัดการแบรนด์และโปรเจกต์</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                            className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            placeholder="กรอกรหัสผ่าน"
                            autoFocus
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium mt-6 text-lg shadow-lg"
                    >
                        เข้าสู่ระบบ
                    </button>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            รหัสทดสอบ: <span className="font-mono bg-gray-100 px-2 py-1 rounded">Superadmin123</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Main Dashboard
    const tabs = [
        { id: 'brands', name: '🏷️ แบรนด์', icon: '🏷️' },
        { id: 'projects', name: '📁 โปรเจกต์', icon: '📁' },
        { id: 'products', name: '🧩 สินค้า', icon: '🧩' },
        { id: 'productfocus', name: '🌟 Product Focus', icon: '🌟' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">🎨 Brand Project Admin</h1>
                            <p className="text-blue-100 text-sm">ระบบจัดการแบรนด์และโปรเจกต์</p>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-lg"
                        >
                            <LogOut size={20} />
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setShowForm(false);
                                setEditingItem(null);
                                setSearchTerm('');
                            }}
                            className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                                }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Search Bar and Add Button - Hide for productfocus tab */}
                {activeTab !== 'productfocus' && (
                    <div className="mb-6 flex gap-3 flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="ค้นหา..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => { setShowForm(true); setEditingItem(null); }}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-lg"
                        >
                            <Plus size={20} />
                            เพิ่มข้อมูลใหม่
                        </button>
                    </div>
                )}

                {/* Forms */}
                {showForm && activeTab !== 'productfocus' && (
                    <div>
                        {activeTab === 'brands' && <BrandForm />}
                        {activeTab === 'projects' && <ProjectForm />}
                        {activeTab === 'products' && <ProductForm />}
                    </div>
                )}

                {/* Data Table */}
                <DataTable />

                {/* Stats - Hide for productfocus tab */}
                {activeTab !== 'productfocus' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">แบรนด์ทั้งหมด</p>
                                    <p className="text-3xl font-bold text-blue-600">{brands.length}</p>
                                </div>
                                <div className="text-4xl">🏷️</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">โปรเจกต์ทั้งหมด</p>
                                    <p className="text-3xl font-bold text-purple-600">{projects.length}</p>
                                </div>
                                <div className="text-4xl">📁</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">สินค้าทั้งหมด</p>
                                    <p className="text-3xl font-bold text-green-600">{products.length}</p>
                                </div>
                                <div className="text-4xl">🧩</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit2, Trash2, Save, X, LogOut, Search, Image as ImageIcon, Star, MoveUp, MoveDown, Home } from 'lucide-react';

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

interface HomeSlider {
    slider_id: number;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

interface HomepageFocus {
    focus_id: number;
    brand_name: string;
    brand_logo: string;
    description: string;
    made_in: string;
    brand_link: string;
    is_active: boolean;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('brands');
    const [searchTerm, setSearchTerm] = useState('');

    const [brands, setBrands] = useState<Brand[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [homeSliders, setHomeSliders] = useState<HomeSlider[]>([]);
    const [homepageFocus, setHomepageFocus] = useState<HomepageFocus | null>(null);

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
                case 'homeslider': endpoint = '/api/home-slider'; break;
                case 'homefocus': endpoint = '/api/homepage-focus'; break;
                default:
                    setLoading(false);
                    return;
            }

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            switch (activeTab) {
                case 'brands': setBrands(Array.isArray(data) ? data : []); break;
                case 'projects': setProjects(Array.isArray(data) ? data : []); break;
                case 'products': setProducts(Array.isArray(data) ? data : []); break;
                case 'homeslider': setHomeSliders(Array.isArray(data) ? data : []); break;
                case 'homefocus':
                    setHomepageFocus(Array.isArray(data) && data.length > 0 ? data[0] : null);
                    break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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

    // Home Slider Management
    const handleAddSlider = async (imageUrl: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/home-slider', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: imageUrl })
            });

            if (response.ok) {
                alert('เพิ่มรูปภาพสำเร็จ!');
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการเพิ่มรูปภาพ');
            }
        } catch (error) {
            console.error('Error adding slider:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    const handleDeleteSlider = async (sliderId: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้? (ต้องเหลืออย่างน้อย 3 รูป)')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/home-slider/${sliderId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('ลบรูปภาพสำเร็จ!');
                fetchData();
            } else {
                const error = await response.json();
                alert(error.error || 'เกิดข้อผิดพลาดในการลบรูปภาพ');
            }
        } catch (error) {
            console.error('Error deleting slider:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    const handleMoveSlider = async (index: number, direction: 'up' | 'down') => {
        const newSliders = [...homeSliders];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newSliders.length) return;

        // Swap
        [newSliders[index], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[index]];

        // Update display_order
        const updatedSliders = newSliders.map((slider, idx) => ({
            slider_id: slider.slider_id,
            display_order: idx + 1
        }));

        setLoading(true);
        try {
            const response = await fetch('/api/home-slider', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sliders: updatedSliders })
            });

            if (response.ok) {
                fetchData();
            } else {
                alert('เกิดข้อผิดพลาดในการเปลี่ยนลำดับ');
            }
        } catch (error) {
            console.error('Error moving slider:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    // Homepage Focus Management
    const handleSaveHomepageFocus = async (focusData: Partial<HomepageFocus>) => {
        setLoading(true);
        try {
            const method = homepageFocus ? 'PUT' : 'POST';
            const body = homepageFocus
                ? { ...focusData, focus_id: homepageFocus.focus_id }
                : focusData;

            const response = await fetch('/api/homepage-focus', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert('บันทึกข้อมูล Product Focus สำเร็จ!');
                fetchData();
                setShowForm(false);
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            console.error('Error saving homepage focus:', error);
            alert('เกิดข้อผิดพลาด');
        }
        setLoading(false);
    };

    // Home Slider UI Component
    const HomeSliderManagement = () => {
        const [newImageUrl, setNewImageUrl] = useState('');

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Home className="text-blue-600" size={28} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">จัดการสไลด์รูปภาพหน้า Home</h2>
                            <p className="text-sm text-gray-600">ต้องมีรูปภาพอย่างน้อย 3 รูป</p>
                        </div>
                    </div>

                    {/* Add New Slider */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="ใส่ URL รูปภาพหรือคลิกอัปโหลด"
                            className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition">
                            <Upload size={20} />
                            อัปโหลด
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await handleImageUpload(file);
                                        if (url) setNewImageUrl(url);
                                    }
                                }}
                            />
                        </label>
                        <button
                            onClick={() => {
                                if (newImageUrl) {
                                    handleAddSlider(newImageUrl);
                                    setNewImageUrl('');
                                } else {
                                    alert('กรุณาใส่ URL รูปภาพ');
                                }
                            }}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            เพิ่มรูปภาพ
                        </button>
                    </div>
                </div>

                {/* Slider List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        รูปภาพปัจจุบัน ({homeSliders.length} รูป)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {homeSliders.map((slider, index) => (
                            <div key={slider.slider_id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="relative aspect-video mb-3">
                                    <img
                                        src={slider.image_url}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        ลำดับที่ {slider.display_order}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleMoveSlider(index, 'up')}
                                        disabled={index === 0 || loading}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg disabled:bg-gray-300 flex items-center justify-center gap-1 transition"
                                    >
                                        <MoveUp size={16} />
                                        ขึ้น
                                    </button>
                                    <button
                                        onClick={() => handleMoveSlider(index, 'down')}
                                        disabled={index === homeSliders.length - 1 || loading}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg disabled:bg-gray-300 flex items-center justify-center gap-1 transition"
                                    >
                                        <MoveDown size={16} />
                                        ลง
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSlider(slider.slider_id)}
                                        disabled={homeSliders.length <= 3 || loading}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg disabled:bg-gray-300 flex items-center justify-center gap-1 transition"
                                    >
                                        <Trash2 size={16} />
                                        ลบ
                                    </button>
                                </div>
                                {homeSliders.length <= 3 && (
                                    <p className="text-xs text-red-600 mt-2 text-center">
                                        ต้องมีรูปอย่างน้อย 3 รูป
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Homepage Focus UI Component
    const HomepageFocusManagement = () => {
        const [formData, setFormData] = useState({
            brand_name: homepageFocus?.brand_name || '',
            brand_logo: homepageFocus?.brand_logo || '',
            description: homepageFocus?.description || '',
            made_in: homepageFocus?.made_in || '',
            brand_link: homepageFocus?.brand_link || ''
        });

        useEffect(() => {
            if (homepageFocus) {
                setFormData({
                    brand_name: homepageFocus.brand_name || '',
                    brand_logo: homepageFocus.brand_logo || '',
                    description: homepageFocus.description || '',
                    made_in: homepageFocus.made_in || '',
                    brand_link: homepageFocus.brand_link || ''
                });
            }
        }, [homepageFocus]);

        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Star className="text-yellow-500" size={28} />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Product Focus - หน้า Home</h2>
                        <p className="text-sm text-gray-600">แก้ไขข้อมูลแบรนด์ที่แสดงในหน้า Homepage</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ชื่อแบรนด์</label>
                        <input
                            type="text"
                            value={formData.brand_name}
                            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                            placeholder="เช่น atlas concorde"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">คำอธิบาย</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="A system of indoor & outdoor surfaces..."
                            rows={3}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ผลิตจาก (Made in)</label>
                        <input
                            type="text"
                            value={formData.made_in}
                            onChange={(e) => setFormData({ ...formData, made_in: e.target.value })}
                            placeholder="เช่น Italy"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ลิงก์แบรนด์</label>
                        <input
                            type="url"
                            value={formData.brand_link}
                            onChange={(e) => setFormData({ ...formData, brand_link: e.target.value })}
                            placeholder="https://www.example.com"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">โลโก้แบรนด์ (URL) - ถ้ามี</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.brand_logo}
                                onChange={(e) => setFormData({ ...formData, brand_logo: e.target.value })}
                                placeholder="https://..."
                                className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition">
                                <Upload size={20} />
                                อัปโหลด
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const url = await handleImageUpload(file);
                                            if (url) setFormData({ ...formData, brand_logo: url });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {formData.brand_logo && (
                            <div className="mt-3">
                                <img src={formData.brand_logo} alt="Brand Logo" className="w-32 h-32 object-contain rounded-lg border" />
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => handleSaveHomepageFocus(formData)}
                            disabled={loading || !formData.brand_name}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                {formData.brand_name && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">ตัวอย่างการแสดงผล:</h3>
                        <div className="bg-white p-4 rounded-lg">
                            {formData.brand_logo && (
                                <img src={formData.brand_logo} alt="Logo" className="h-12 mb-2" />
                            )}
                            <div className="text-2xl font-bold text-gray-900 mb-2">{formData.brand_name}</div>
                            <p className="text-gray-700 mb-2">{formData.description}</p>
                            {formData.made_in && (
                                <p className="text-gray-800">
                                    <span className="font-semibold">Made in: </span>
                                    <span>{formData.made_in}</span>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="text-white" size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">รหัสผ่าน</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Main Dashboard
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">🎨 Admin Dashboard</h1>
                        <p className="text-blue-100">จัดการข้อมูลระบบ AMO</p>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition flex items-center gap-2"
                    >
                        <LogOut size={20} />
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex overflow-x-auto">
                        {[
                            { id: 'brands', label: '🏷️ แบรนด์' },
                            { id: 'projects', label: '📁 โปรเจกต์' },
                            { id: 'products', label: '🛋️ สินค้า' },
                            { id: 'homeslider', label: '🖼️ Slider หน้า Home' },
                            { id: 'homefocus', label: '⭐ Product Focus' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setShowForm(false); setSearchTerm(''); }}
                                className={`px-6 py-4 font-medium transition whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                {activeTab === 'homeslider' && <HomeSliderManagement />}
                {activeTab === 'homefocus' && <HomepageFocusManagement />}
                {/* Add other existing tab content here */}
            </div>
        </div>
    );
}
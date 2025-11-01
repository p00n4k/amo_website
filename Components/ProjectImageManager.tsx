'use client';

// ============================================
// 📁 Component: ProjectImageManager
// ============================================
// ใช้ใน Admin page สำหรับจัดการรูปภาพของ Project
// ============================================

import React, { useState, useEffect } from 'react';
import { Upload, X, Star, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ProjectImage {
    image_id: number;
    project_id: number;
    image_url: string;
    display_order: number;
    caption: string | null;
    is_cover: boolean;
}

interface ProjectImageManagerProps {
    projectId: number;
    onClose: () => void;
}

export default function ProjectImageManager({ projectId, onClose }: ProjectImageManagerProps) {
    const [images, setImages] = useState<ProjectImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newCaption, setNewCaption] = useState('');

    // ดึงรูปภาพทั้งหมดของ Project
    const fetchImages = async () => {
        try {
            const response = await fetch(`/api/project-images?project_id=${projectId}`);
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            alert('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchImages();
        }
    }, [projectId]);

    // อัปโหลดรูปภาพ
    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            // อัปโหลดไฟล์
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) throw new Error('Upload failed');

            const { url } = await uploadResponse.json();

            // บันทึกลงฐานข้อมูล
            const saveResponse = await fetch('/api/project-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: projectId,
                    image_url: url,
                    caption: newCaption || null,
                    is_cover: images.length === 0, // รูปแรกจะเป็น cover
                }),
            });

            if (!saveResponse.ok) throw new Error('Save failed');

            alert('เพิ่มรูปภาพสำเร็จ!');
            setNewCaption('');
            fetchImages();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setUploading(false);
        }
    };

    // ตั้งรูปเป็น Cover
    const setCoverImage = async (imageId: number) => {
        setLoading(true);
        try {
            const response = await fetch('/api/project-images', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_id: imageId,
                    is_cover: true,
                    project_id: projectId,
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            alert('ตั้งรูป Cover สำเร็จ!');
            fetchImages();
        } catch (error) {
            console.error('Error setting cover:', error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    // ลบรูปภาพ
    const deleteImage = async (imageId: number) => {
        if (!confirm('คุณต้องการลบรูปภาพนี้ใช่หรือไม่?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/project-images?image_id=${imageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Delete failed');

            alert('ลบรูปภาพสำเร็จ!');
            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    // อัปเดต Caption
    const updateCaption = async (imageId: number, caption: string) => {
        try {
            const response = await fetch('/api/project-images', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_id: imageId,
                    caption: caption,
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            fetchImages();
        } catch (error) {
            console.error('Error updating caption:', error);
            alert('เกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <ImageIcon className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800">จัดการรูปภาพโปรเจกต์</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Upload Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-dashed border-blue-300">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            📸 เพิ่มรูปภาพใหม่
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    คำอธิบายรูปภาพ (ไม่บังคับ)
                                </label>
                                <input
                                    type="text"
                                    value={newCaption}
                                    onChange={(e) => setNewCaption(e.target.value)}
                                    placeholder="เช่น: ห้องนั่งเล่น, ห้องนอน, ห้องครัว..."
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer inline-flex items-center gap-2 transition font-medium">
                                <Upload size={20} />
                                {uploading ? 'กำลังอัปโหลด...' : 'เลือกรูปภาพ'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file);
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Images Grid */}
                    {images.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg">ยังไม่มีรูปภาพในโปรเจกต์นี้</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((img) => (
                                <div
                                    key={img.image_id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-video">
                                        <img
                                            src={img.image_url}
                                            alt={img.caption || 'Project image'}
                                            className="w-full h-full object-cover"
                                        />
                                        {img.is_cover && (
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                <Star size={16} fill="white" />
                                                COVER
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 space-y-3">
                                        <input
                                            type="text"
                                            value={img.caption || ''}
                                            onChange={(e) => updateCaption(img.image_id, e.target.value)}
                                            placeholder="คำอธิบาย..."
                                            className="w-full text-sm border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />

                                        <div className="flex gap-2">
                                            {!img.is_cover && (
                                                <button
                                                    onClick={() => setCoverImage(img.image_id)}
                                                    disabled={loading}
                                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition disabled:bg-gray-400 flex items-center justify-center gap-1"
                                                >
                                                    <Star size={16} />
                                                    ตั้งเป็น Cover
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteImage(img.image_id)}
                                                disabled={loading}
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition disabled:bg-gray-400 flex items-center gap-1"
                                            >
                                                <Trash2 size={16} />
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}
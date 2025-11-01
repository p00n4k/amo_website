'use client';

// ============================================
// 📁 Component: ProjectCollectionManager
// ============================================
// ใช้ใน Admin page สำหรับจัดการ Collection ที่เชื่อมกับ Project
// ============================================

import React, { useState, useEffect } from 'react';
import { Plus, X, Link as LinkIcon, Trash2, Package } from 'lucide-react';

interface Collection {
    collection_id: number;
    collection_name: string;
    type: string;
    display_order?: number;
    project_collection_id?: number;
}

interface ProjectCollectionManagerProps {
    projectId: number;
    onClose: () => void;
}

export default function ProjectCollectionManager({
    projectId,
    onClose,
}: ProjectCollectionManagerProps) {
    const [linkedCollections, setLinkedCollections] = useState<Collection[]>([]);
    const [allCollections, setAllCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // ดึง Collections ที่เชื่อมกับ Project นี้
    const fetchLinkedCollections = async () => {
        try {
            const response = await fetch(`/api/project-collections?project_id=${projectId}`);
            const data = await response.json();
            setLinkedCollections(data);
        } catch (error) {
            console.error('Error fetching linked collections:', error);
        }
    };

    // ดึง Collections ทั้งหมด
    const fetchAllCollections = async () => {
        try {
            const response = await fetch('/api/project-collections');
            const data = await response.json();
            setAllCollections(data);
        } catch (error) {
            console.error('Error fetching all collections:', error);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchLinkedCollections();
            fetchAllCollections();
        }
    }, [projectId]);

    // เพิ่ม Collection ให้ Project
    const addCollection = async (collectionId: number) => {
        setLoading(true);
        try {
            const response = await fetch('/api/project-collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: projectId,
                    collection_id: collectionId,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add collection');
            }

            alert('เพิ่ม Collection สำเร็จ!');
            fetchLinkedCollections();
            setShowAddModal(false);
        } catch (error: any) {
            console.error('Error adding collection:', error);
            alert(error.message || 'เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    // ลบ Collection ออกจาก Project
    const removeCollection = async (projectCollectionId: number) => {
        if (!confirm('คุณต้องการลบ Collection นี้ออกจากโปรเจกต์ใช่หรือไม่?')) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/project-collections?project_collection_id=${projectCollectionId}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) throw new Error('Delete failed');

            alert('ลบ Collection สำเร็จ!');
            fetchLinkedCollections();
        } catch (error) {
            console.error('Error removing collection:', error);
            alert('เกิดข้อผิดพลาด');
        } finally {
            setLoading(false);
        }
    };

    // Collections ที่ยังไม่ได้เชื่อม
    const availableCollections = allCollections.filter(
        (col) => !linkedCollections.some((linked) => linked.collection_id === col.collection_id)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Package className="text-purple-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800">จัดการ Collection</h2>
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
                    {/* Add Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 mb-6"
                    >
                        <Plus size={20} />
                        เพิ่ม Collection ใหม่
                    </button>

                    {/* Linked Collections */}
                    {linkedCollections.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Package size={64} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg">ยังไม่มี Collection ในโปรเจกต์นี้</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {linkedCollections.map((col) => (
                                <div
                                    key={col.project_collection_id}
                                    className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 transition flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                                            {col.collection_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {col.collection_name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    {col.type}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeCollection(col.project_collection_id!)}
                                        disabled={loading}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:bg-gray-400 flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        ลบ
                                    </button>
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

            {/* Add Collection Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">
                                เลือก Collection ที่ต้องการเพิ่ม
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {availableCollections.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <p>ไม่มี Collection ที่สามารถเพิ่มได้</p>
                                    <p className="text-sm mt-2">Collection ทั้งหมดถูกเชื่อมกับโปรเจกต์นี้แล้ว</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableCollections.map((col) => (
                                        <button
                                            key={col.collection_id}
                                            onClick={() => addCollection(col.collection_id)}
                                            disabled={loading}
                                            className="bg-white border-2 border-gray-200 hover:border-purple-400 rounded-xl p-4 text-left transition disabled:opacity-50"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                                                    {col.collection_name.charAt(0)}
                                                </div>
                                                <h4 className="font-bold text-gray-800">{col.collection_name}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                    {col.type}
                                                </span>
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 p-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// ============================================
// 📝 วิธีแก้ไขไฟล์ app/admin/page.tsx
// ============================================

// ============================================
// STEP 1: เพิ่ม imports ที่ด้านบน (หลังจาก 'use client')
// ============================================

// ไฟล์ app/admin/page.tsx ควรเริ่มต้นแบบนี้:

'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit2, Trash2, Save, X, LogOut, Search, Image as ImageIcon, Star, Package } from 'lucide-react';

// ⚠️ เพิ่ม imports สำหรับ Components ใหม่
import ProjectImageManager from '@/Components/ProjectImageManager';
import ProjectCollectionManager from '@/Components/ProjectCollectionManager';

// Types (เดิม - ไม่ต้องแก้)
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

// ... rest of interfaces

// ============================================
// STEP 2: เพิ่ม state variables ในฟังก์ชัน AdminDashboard
// ============================================

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('brands');
    const [searchTerm, setSearchTerm] = useState('');

    // ... existing state

    // ⚠️ เพิ่ม state ใหม่สำหรับ Modal
    const [showImageManager, setShowImageManager] = useState(false);
    const [showCollectionManager, setShowCollectionManager] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    // ... rest of the code
}

// ============================================
// STEP 3: แก้ไข projectColumns
// ============================================

// ค้นหาบรรทัดที่มี projectColumns และแก้ไขเป็น:

const projectColumns = [
    { key: 'project_id', label: 'ID' },
    { key: 'project_name', label: 'ชื่อโปรเจกต์' },
    { key: 'data_update', label: 'วันที่อัปเดต' },
    { key: 'project_category', label: 'ประเภท' },
    { key: 'actions', label: 'จัดการ' } // ⚠️ เพิ่มบรรทัดนี้
];

// ============================================
// STEP 4: แก้ไขส่วน render ตาราง Project
// ============================================

// ค้นหาส่วนที่ render ตาราง Project (มักจะอยู่ใน activeTab === 'projects')
// แก้ไขส่วนที่ map columns ให้เป็น:

<tbody className="divide-y divide-gray-200">
    {filteredData.map((item: any, idx: number) => (
        <tr key={idx} className="hover:bg-gray-50 transition">
            {projectColumns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-800">
                    {col.key === 'actions' ? (
                        // ⚠️ เพิ่มส่วนนี้
                        <div className="flex gap-2">
                            {/* ปุ่มจัดการรูปภาพ */}
                            <button
                                onClick={() => {
                                    setSelectedProjectId(item.project_id);
                                    setShowImageManager(true);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                                title="จัดการรูปภาพ"
                            >
                                <ImageIcon size={18} />
                            </button>

                            {/* ปุ่มจัดการ Collection */}
                            <button
                                onClick={() => {
                                    setSelectedProjectId(item.project_id);
                                    setShowCollectionManager(true);
                                }}
                                className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition"
                                title="จัดการ Collection"
                            >
                                <Package size={18} />
                            </button>

                            {/* ปุ่มแก้ไข */}
                            <button
                                onClick={() => {
                                    setEditingItem(item);
                                    setShowForm(true);
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition"
                            >
                                <Edit2 size={18} />
                            </button>

                            {/* ปุ่มลบ */}
                            <button
                                onClick={() => handleDelete(item.project_id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ) : col.key === 'project_category' ? (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${item[col.key] === 'Residential'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {item[col.key] === 'Residential' ? 'บ้านพักอาศัย' : 'พาณิชย์'}
                        </span>
                    ) : (
                        item[col.key]
                    )}
                </td>
            ))}
        </tr>
    ))}
</tbody>

// ============================================
// STEP 5: เพิ่ม Modals ท้ายหน้า (ก่อน closing tag ของ return)
// ============================================

// ค้นหาท้ายสุดของ return ( ... ) ใน AdminDashboard
// เพิ่มโค้ดนี้ก่อน </div> ปิดท้ายสุด:

return (
    <div className="min-h-screen bg-gray-50">
        {/* ... existing code ... */}

        {/* ⚠️ เพิ่มส่วนนี้ก่อนปิด </div> ท้ายสุด */}

        {/* Project Image Manager Modal */}
        {showImageManager && selectedProjectId && (
            <ProjectImageManager
                projectId={selectedProjectId}
                onClose={() => {
                    setShowImageManager(false);
                    setSelectedProjectId(null);
                }}
            />
        )}

        {/* Project Collection Manager Modal */}
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


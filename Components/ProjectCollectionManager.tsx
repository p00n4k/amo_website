"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, GripVertical } from "lucide-react";

interface ProjectCollectionManagerProps {
    projectId: number;
    onClose: () => void;
}

interface Collection {
    collection_id: number;
    type: string;
    detail?: string;
    image?: string;
    display_order?: number;
    project_collection_id?: number;
}

export default function ProjectCollectionManager({
    projectId,
    onClose,
}: ProjectCollectionManagerProps) {
    const [allCollections, setAllCollections] = useState<Collection[]>([]);
    const [linkedCollections, setLinkedCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // ========================================
    // 🔹 โหลดข้อมูล Collections ทั้งหมด + ที่เชื่อมกับ Project นี้
    // ========================================
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);

                // ดึงทั้งหมด
                const resAll = await fetch("/api/project-collections");
                const allData = await resAll.json();

                // ดึงเฉพาะที่เชื่อมกับ Project นี้
                const resLinked = await fetch(`/api/project-collections?project_id=${projectId}`);
                const linkedData = await resLinked.json();

                setAllCollections(Array.isArray(allData) ? allData : []);
                setLinkedCollections(Array.isArray(linkedData) ? linkedData : []);
            } catch (err) {
                console.error("Error loading collections:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, [projectId, refreshKey]);

    // ========================================
    // ➕ เพิ่ม Collection ให้ Project
    // ========================================
    const handleAdd = async () => {
        if (!selectedCollectionId) return;
        try {
            const res = await fetch("/api/project-collections", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: projectId,
                    collection_id: selectedCollectionId,
                    display_order: linkedCollections.length + 1,
                }),
            });

            if (!res.ok) throw new Error("Add failed");
            setRefreshKey((k) => k + 1);
            setIsAdding(false);
            setSelectedCollectionId(null);
        } catch (err) {
            console.error("Error adding collection:", err);
            alert("ไม่สามารถเพิ่ม Collection ได้");
        }
    };

    // ========================================
    // 🗑️ ลบ Collection ออกจาก Project
    // ========================================
    const handleDelete = async (projectCollectionId: number) => {
        if (!confirm("ต้องการลบ Collection นี้ออกจาก Project หรือไม่?")) return;
        try {
            const res = await fetch(
                `/api/project-collections?project_collection_id=${projectCollectionId}`,
                { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Delete failed");
            setRefreshKey((k) => k + 1);
        } catch (err) {
            console.error("Error deleting:", err);
            alert("ไม่สามารถลบได้");
        }
    };

    // ========================================
    // 🔄 อัปเดตลำดับ display_order
    // ========================================
    const handleReorder = async (projectCollectionId: number, direction: "up" | "down") => {
        const currentIndex = linkedCollections.findIndex(
            (c) => c.project_collection_id === projectCollectionId
        );
        if (currentIndex === -1) return;

        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= linkedCollections.length) return;

        const reordered = [...linkedCollections];
        const [movedItem] = reordered.splice(currentIndex, 1);
        reordered.splice(newIndex, 0, movedItem);

        // update display_order ตามลำดับใหม่
        for (let i = 0; i < reordered.length; i++) {
            reordered[i].display_order = i + 1;
            await fetch("/api/project-collections", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_collection_id: reordered[i].project_collection_id,
                    display_order: reordered[i].display_order,
                }),
            });
        }

        setLinkedCollections(reordered);
    };

    // ========================================
    // 🖼️ UI ส่วนบน
    // ========================================
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-lg relative p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">
                    จัดการ Collections ของ Project #{projectId}
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500 py-10">กำลังโหลดข้อมูล...</p>
                ) : (
                    <>
                        {/* Existing linked collections */}
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                            {linkedCollections.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">
                                    ยังไม่มี Collections ใน Project นี้
                                </p>
                            ) : (
                                linkedCollections.map((col) => (
                                    <div
                                        key={col.project_collection_id}
                                        className="flex items-center justify-between bg-gray-50 rounded-lg border p-3 shadow-sm hover:bg-gray-100 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            {col.image && (
                                                <img
                                                    src={col.image}
                                                    alt={col.type}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {col.type
                                                        ? col.type.charAt(0).toUpperCase() + col.type.slice(1)
                                                        : "(No name)"}
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                    {col.detail || ""}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleReorder(col.project_collection_id!, "up")}
                                                className="text-gray-400 hover:text-black"
                                                title="Move Up"
                                            >
                                                <GripVertical size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReorder(col.project_collection_id!, "down")}
                                                className="text-gray-400 hover:text-black rotate-180"
                                                title="Move Down"
                                            >
                                                <GripVertical size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(col.project_collection_id!)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add new collection section */}
                        {isAdding ? (
                            <div className="mt-5 bg-gray-100 p-4 rounded-lg border">
                                <h3 className="font-medium mb-2">เพิ่ม Collection ใหม่</h3>
                                <select
                                    className="border rounded-md px-3 py-2 w-full mb-3"
                                    value={selectedCollectionId || ""}
                                    onChange={(e) => setSelectedCollectionId(Number(e.target.value))}
                                >
                                    <option value="">-- เลือก Collection --</option>
                                    {allCollections
                                        .filter(
                                            (c) =>
                                                !linkedCollections.some(
                                                    (lc) => lc.collection_id === c.collection_id
                                                )
                                        )
                                        .map((c) => (
                                            <option key={c.collection_id} value={c.collection_id}>
                                                {c.type
                                                    ? c.type.charAt(0).toUpperCase() + c.type.slice(1)
                                                    : "(No name)"}
                                            </option>
                                        ))}
                                </select>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={handleAdd}
                                        className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800"
                                    >
                                        บันทึก
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-5 flex justify-end">
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                                >
                                    <Plus size={18} /> เพิ่ม Collection
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

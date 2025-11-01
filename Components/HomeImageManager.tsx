"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

export default function HomeImageManager() {
    const [images, setImages] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const loadImages = async () => {
        const res = await fetch("/api/home-slider");
        const data = await res.json();
        setImages(data);
    };

    useEffect(() => {
        loadImages();
    }, []);

    // ✅ Upload image
    const handleUpload = async () => {
        if (!file) return alert("กรุณาเลือกไฟล์ก่อน");

        try {
            setUploading(true);

            // Step 1: upload physical file
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/home-slider/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error);

            // Step 2: save record in DB
            await fetch("/api/home-slider", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: uploadData.image_url }),
            });

            alert("อัปโหลดสำเร็จ");
            setFile(null);
            loadImages();
        } catch (err) {
            console.error("Upload failed:", err);
            alert("อัปโหลดไม่สำเร็จ");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("ต้องการลบภาพนี้หรือไม่?")) return;
        await fetch(`/api/home-slider?slider_id=${id}`, { method: "DELETE" });
        loadImages();
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">🖼️ จัดการภาพหน้า Home</h2>

            {/* Upload Section */}
            <div className="mb-6 flex items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="border rounded-md p-2 w-64"
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${uploading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                        }`}
                >
                    <Upload size={18} /> {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {/* Preview Section */}
            {images.length === 0 ? (
                <p className="text-gray-500">ยังไม่มีภาพในหน้า Home</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {images.map((img) => (
                        <div
                            key={img.slider_id}
                            className="relative border rounded-lg overflow-hidden shadow-sm group"
                        >
                            <img
                                src={img.image_url}
                                alt="slider"
                                className="w-full h-40 object-cover"
                            />
                            <button
                                onClick={() => handleDelete(img.slider_id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";
import { useState } from "react";
import { Brand } from "./types";
import { api, uploadImage } from "./utils";
import { SectionCard, Field, Button, TextInput } from "./ui";

export default function BrandAdmin({
    brands,
    reload,
}: {
    brands: Brand[];
    reload: () => Promise<void>;
}) {
    const [form, setForm] = useState<Brand>({
        brandname: "",
        main_type: "",
        type: "",
        brand_url: "",
        image: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // ✅ Reset form
    function resetForm() {
        setForm({ brandname: "", main_type: "", type: "", brand_url: "", image: "" });
        setEditingId(null);
    }

    // ✅ Submit (Create or Update)
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: Brand = {
                brandname: form.brandname.trim(),
                main_type: form.main_type || "",
                type: form.type || "",
                brand_url: form.brand_url || "",
                image: form.image || "",
            };
            if (!payload.brandname) throw new Error("Brand name is required");

            if (editingId) {
                await api(`/brands/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                await api(`/brands`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            resetForm();
            await reload();
            alert("✅ Brand saved successfully");
        } catch (err: any) {
            alert(`❌ Save failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // ✅ Delete
    async function deleteBrand(id: number) {
        if (!confirm("Delete this brand?")) return;
        await api(`/brands/${id}`, { method: "DELETE" });
        await reload();
    }

    // ✅ Upload image
    async function onImagePick(file?: File | null) {
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setForm((f) => ({ ...f, image: url }));
        } catch (e: any) {
            alert(`Upload failed: ${e.message}`);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <SectionCard title={editingId ? `Edit Brand #${editingId}` : "Create Brand"}>
                <form onSubmit={submit} className="space-y-3">
                    <Field label="Brand Name">
                        <TextInput
                            value={form.brandname}
                            onChange={(e) => setForm({ ...form, brandname: e.target.value })}
                            required
                        />
                    </Field>

                    <Field label="Main Type">
                        <TextInput
                            placeholder="e.g. TILE, FURNITURE"
                            value={form.main_type}
                            onChange={(e) => setForm({ ...form, main_type: e.target.value })}
                        />
                    </Field>

                    <Field label="Sub Type">
                        <TextInput
                            placeholder="e.g. Ceramic, Wood"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        />
                    </Field>

                    <Field label="Brand URL">
                        <TextInput
                            placeholder="https://example.com"
                            value={form.brand_url}
                            onChange={(e) => setForm({ ...form, brand_url: e.target.value })}
                        />
                    </Field>

                    <Field label="Image URL">
                        <div className="flex gap-2 items-center">
                            <TextInput
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onImagePick(e.target.files?.[0])}
                            />
                        </div>
                    </Field>

                    {form.image && (
                        <img
                            src={form.image}
                            className="h-20 rounded border object-cover"
                            alt="preview"
                        />
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={loading}>
                            {editingId ? "Update" : "Create"}
                        </Button>
                        {editingId && (
                            <Button
                                type="button"
                                className="bg-gray-200 text-gray-900"
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* List Section */}
            <SectionCard title="Brands List">
                <table className="min-w-full text-sm border-collapse border border-gray-500">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-2 border border-gray-600">ID</th>
                            <th className="p-2 border border-gray-600">Image</th>
                            <th className="p-2 border border-gray-600">Name</th>
                            <th className="p-2 border border-gray-600">Main Type</th>
                            <th className="p-2 border border-gray-600">Type</th>
                            <th className="p-2 border border-gray-600">URL</th>
                            <th className="p-2 border border-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((b) => (
                            <tr key={b.brand_id} className="hover:bg-gray-800">
                                <td className="p-2 border border-gray-600">{b.brand_id}</td>
                                <td className="p-2 border border-gray-600">
                                    {b.image ? (
                                        <img
                                            src={b.image}
                                            className="h-10 w-10 object-cover rounded"
                                            alt={b.brandname}
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="p-2 border border-gray-600">{b.brandname}</td>
                                <td className="p-2 border border-gray-600">
                                    {b.main_type || "-"}
                                </td>
                                <td className="p-2 border border-gray-600">{b.type || "-"}</td>
                                <td className="p-2 border border-gray-600">
                                    {b.brand_url ? (
                                        <a
                                            href={b.brand_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 underline"
                                        >
                                            Link ↗
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="p-2 border border-gray-600 flex gap-1">
                                    <Button
                                        className="bg-white text-black border"
                                        onClick={() => {
                                            setEditingId(b.brand_id!);
                                            setForm({
                                                brandname: b.brandname,
                                                main_type: b.main_type || "",
                                                type: b.type || "",
                                                brand_url: b.brand_url || "",
                                                image: b.image || "",
                                                brand_id: b.brand_id,
                                            });
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="bg-red-600"
                                        onClick={() => deleteBrand(b.brand_id!)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SectionCard>
        </div>
    );
}

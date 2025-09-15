"use client";
import { useState } from "react";
import { Brand, Collection, ProjectImage } from "./types";
import { api, uploadImage } from "./utils";

import { SectionCard, Field, Button, TextInput } from "./ui";

export default function BrandAdmin({
    brands,
    reload,
}: {
    brands: Brand[];
    reload: () => Promise<void>;
}) {
    const [form, setForm] = useState<Brand>({ brandname: "", type: "", image: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: Brand = {
                brandname: form.brandname.trim(),
                type: form.type || "",
                image: form.image || "",
            };
            if (!payload.brandname) throw new Error("brandname is required");

            if (editingId) {
                await api(`/brands/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
            } else {
                await api(`/brands`, { method: "POST", body: JSON.stringify(payload) });
            }

            setForm({ brandname: "", type: "", image: "" });
            setEditingId(null);
            await reload();
            alert("Brand saved");
        } catch (err: any) {
            alert(`Save failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function deleteBrand(id: number) {
        if (!confirm("Delete this brand?")) return;
        await api(`/brands/${id}`, { method: "DELETE" });
        await reload();
    }

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
            {/* Form */}
            <SectionCard title={editingId ? `Edit Brand #${editingId}` : "Create Brand"}>
                <form onSubmit={submit} className="space-y-3">
                    <Field label="Brand Name">
                        <TextInput
                            value={form.brandname}
                            onChange={(e) => setForm({ ...form, brandname: e.target.value })}
                            required
                        />
                    </Field>
                    <Field label="Type">
                        <TextInput
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        />
                    </Field>
                    <Field label="Image URL">
                        <div className="flex gap-2 items-center">
                            <TextInput
                                value={form.image}
                                onChange={(e) => setForm({ ...form, image: e.target.value })}
                            />
                            <input type="file" accept="image/*" onChange={(e) => onImagePick(e.target.files?.[0])} />
                        </div>
                    </Field>
                    {form.image && <img src={form.image} className="h-20 rounded border object-cover" />}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>{editingId ? "Update" : "Create"}</Button>
                        {editingId && (
                            <Button type="button" className="bg-gray-200 text-gray-900"
                                onClick={() => { setEditingId(null); setForm({ brandname: "", type: "", image: "" }); }}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* List */}
            <SectionCard title="Brands List">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr><th>ID</th><th>Image</th><th>Name</th><th>Type</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {brands.map((b) => (
                            <tr key={b.brand_id}>
                                <td>{b.brand_id}</td>
                                <td>{b.image ? <img src={b.image} className="h-10 w-10 object-cover" /> : "-"}</td>
                                <td>{b.brandname}</td>
                                <td>{b.type || "-"}</td>
                                <td>
                                    <Button className="bg-white text-black border" onClick={() => { setEditingId(b.brand_id!); setForm(b); }}>Edit</Button>
                                    <Button className="bg-red-600" onClick={() => deleteBrand(b.brand_id!)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SectionCard>
        </div>
    );
}

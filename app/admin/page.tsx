"use client";

import { useEffect, useMemo, useState } from "react";

// ⚙️ Adjust this to your API base. You can also set NEXT_PUBLIC_API_BASE in .env
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost/brand_api";

// Helpers
async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
        cache: "no-store",
        ...init,
    });
    if (!res.ok) {
        let detail: any = undefined;
        try { detail = await res.json(); } catch (_) { }
        throw new Error(detail?.error || detail?.message || res.statusText);
    }
    return (await res.json()) as T;
}

async function uploadImage(file: File): Promise<string> {
    // Tries REST (/upload), falls back to legacy upload.php
    const form = new FormData();
    form.append("file", file);

    // 1) Try /upload (index.php handler)
    try {
        const r = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
        if (r.ok) {
            const j = await r.json();
            if (j?.url) return j.url as string;
        }
    } catch (_) { }

    // 2) Fallback to upload.php (standalone)
    const r2 = await fetch(`${API_BASE}/upload.php`, { method: "POST", body: form });
    if (!r2.ok) throw new Error("Upload failed");
    const j2 = await r2.json();
    if (!j2?.url) throw new Error("Upload failed: no url returned");
    return j2.url as string;
}

// Types
export type Brand = {
    brand_id?: number;
    brandname: string;
    type?: string;
    image?: string;
};

export type Collection = {
    collection_id?: number;
    brand_id: number;
    project_id: number;
    main_type?: string;
    type?: string;
    detail?: string;
    image?: string;
    collection_link?: string;
    status_discontinued?: boolean | number;
};

// UI bits
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
            {children}
        </label>
    );
}

function Button({ children, className = "", ...props }: any) {
    return (
        <button
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${props.className || ""}`}
        />
    );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={`w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/30 ${props.className || ""}`}
        />
    );
}

export default function AdminPage() {
    const [tab, setTab] = useState<"brands" | "collections">("brands");

    // Brands state
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandForm, setBrandForm] = useState<Brand>({ brandname: "", type: "", image: "" });
    const [brandEditingId, setBrandEditingId] = useState<number | null>(null);
    const [loadingBrand, setLoadingBrand] = useState(false);

    // Collections state
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collectionForm, setCollectionForm] = useState<Collection>({
        brand_id: 0,
        project_id: 0,
        main_type: "",
        type: "",
        detail: "",
        image: "",
        collection_link: "",
        status_discontinued: 0,
    });
    const [collectionEditingId, setCollectionEditingId] = useState<number | null>(null);
    const [loadingCollection, setLoadingCollection] = useState(false);

    // Fetchers
    async function loadBrands() {
        const data = await api<Brand[]>("/brands");
        setBrands(data);
    }
    async function loadCollections() {
        const data = await api<Collection[]>("/collections");
        setCollections(
            data.map((c) => ({
                ...c,
                status_discontinued: Number(c.status_discontinued ?? 0) as 0 | 1,
            }))
        );
    }

    useEffect(() => {
        loadBrands().catch(console.error);
        loadCollections().catch(console.error);
    }, []);

    // Submit handlers
    async function submitBrand(e: React.FormEvent) {
        e.preventDefault();
        setLoadingBrand(true);
        try {
            const payload: Brand = {
                brandname: brandForm.brandname?.trim() || "",
                type: brandForm.type || "",
                image: brandForm.image || "",
            };
            if (!payload.brandname) throw new Error("brandname is required");

            if (brandEditingId) {
                await api(`/brands/${brandEditingId}`, { method: "PUT", body: JSON.stringify(payload) });
            } else {
                await api(`/brands`, { method: "POST", body: JSON.stringify(payload) });
            }
            setBrandForm({ brandname: "", type: "", image: "" });
            setBrandEditingId(null);
            await loadBrands();
            alert("Brand saved");
        } catch (err: any) {
            alert(`Save failed: ${err.message}`);
        } finally {
            setLoadingBrand(false);
        }
    }

    async function deleteBrand(id: number) {
        if (!confirm("Delete this brand?")) return;
        await api(`/brands/${id}`, { method: "DELETE" });
        await loadBrands();
    }

    function editBrand(b: Brand) {
        setBrandEditingId(b.brand_id!);
        setBrandForm({ brandname: b.brandname || "", type: b.type || "", image: b.image || "" });
        setTab("brands");
    }

    async function onBrandImagePick(file?: File | null) {
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setBrandForm((f) => ({ ...f, image: url }));
        } catch (e: any) {
            alert(`Upload failed: ${e.message}`);
        }
    }

    async function submitCollection(e: React.FormEvent) {
        e.preventDefault();
        setLoadingCollection(true);
        try {
            const payload: Collection = {
                brand_id: Number(collectionForm.brand_id),
                project_id: Number(collectionForm.project_id),
                main_type: collectionForm.main_type || "",
                type: collectionForm.type || "",
                detail: collectionForm.detail || "",
                image: collectionForm.image || "",
                collection_link: collectionForm.collection_link || "",
                status_discontinued: Number(collectionForm.status_discontinued ? 1 : 0),
            } as Collection;

            if (!payload.brand_id || !payload.project_id) {
                throw new Error("brand_id and project_id are required");
            }

            if (collectionEditingId) {
                await api(`/collections/${collectionEditingId}`, { method: "PUT", body: JSON.stringify(payload) });
            } else {
                await api(`/collections`, { method: "POST", body: JSON.stringify(payload) });
            }

            setCollectionForm({ brand_id: 0, project_id: 0, main_type: "", type: "", detail: "", image: "", collection_link: "", status_discontinued: 0 });
            setCollectionEditingId(null);
            await loadCollections();
            alert("Collection saved");
        } catch (err: any) {
            alert(`Save failed: ${err.message}`);
        } finally {
            setLoadingCollection(false);
        }
    }

    async function deleteCollection(id: number) {
        if (!confirm("Delete this collection?")) return;
        await api(`/collections/${id}`, { method: "DELETE" });
        await loadCollections();
    }

    function editCollection(c: Collection) {
        setCollectionEditingId(c.collection_id!);
        setCollectionForm({
            brand_id: Number(c.brand_id),
            project_id: Number(c.project_id),
            main_type: c.main_type || "",
            type: c.type || "",
            detail: c.detail || "",
            image: c.image || "",
            collection_link: c.collection_link || "",
            status_discontinued: Number(c.status_discontinued ? 1 : 0),
        });
        setTab("collections");
    }

    async function onCollectionImagePick(file?: File | null) {
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setCollectionForm((f) => ({ ...f, image: url }));
        } catch (e: any) {
            alert(`Upload failed: ${e.message}`);
        }
    }

    const brandMap = useMemo(() => {
        const m = new Map<number, string>();
        for (const b of brands) if (b.brand_id) m.set(b.brand_id, b.brandname);
        return m;
    }, [brands]);

    return (
        <div className="min-h-[100dvh] bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <div className="inline-flex rounded-2xl overflow-hidden border border-gray-200">
                        <button
                            className={`px-4 py-2 text-sm ${tab === "brands" ? "bg-black text-white" : "bg-white"}`}
                            onClick={() => setTab("brands")}
                        >
                            Brands
                        </button>
                        <button
                            className={`px-4 py-2 text-sm ${tab === "collections" ? "bg-black text-white" : "bg-white"}`}
                            onClick={() => setTab("collections")}
                        >
                            Collections
                        </button>
                    </div>
                </div>

                {/* Brands */}
                {tab === "brands" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SectionCard title={brandEditingId ? `Edit Brand #${brandEditingId}` : "Create Brand"}>
                            <form onSubmit={submitBrand} className="space-y-3">
                                <Field label="Brand Name">
                                    <TextInput
                                        value={brandForm.brandname}
                                        onChange={(e) => setBrandForm({ ...brandForm, brandname: e.target.value })}
                                        placeholder="e.g. Focus"
                                        required
                                    />
                                </Field>
                                <Field label="Type">
                                    <TextInput
                                        value={brandForm.type}
                                        onChange={(e) => setBrandForm({ ...brandForm, type: e.target.value })}
                                        placeholder="e.g. Ceramic"
                                    />
                                </Field>
                                <Field label="Image URL">
                                    <div className="flex gap-2 items-center">
                                        <TextInput
                                            value={brandForm.image}
                                            onChange={(e) => setBrandForm({ ...brandForm, image: e.target.value })}
                                            placeholder="http://... or /uploads/file.png"
                                        />
                                        <input type="file" accept="image/*" onChange={(e) => onBrandImagePick(e.target.files?.[0])} />
                                    </div>
                                </Field>
                                {brandForm.image ? (
                                    <img src={brandForm.image} alt="preview" className="h-20 rounded-lg border object-cover" />
                                ) : null}
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={loadingBrand}>{brandEditingId ? "Update" : "Create"}</Button>
                                    {brandEditingId && (
                                        <Button type="button" className="bg-gray-200 text-gray-900" onClick={() => { setBrandEditingId(null); setBrandForm({ brandname: "", type: "", image: "" }); }}>Cancel</Button>
                                    )}
                                </div>
                            </form>
                        </SectionCard>

                        <SectionCard title="Brands List">
                            <div className="overflow-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="py-2 pr-4">ID</th>
                                            <th className="py-2 pr-4">Image</th>
                                            <th className="py-2 pr-4">Name</th>
                                            <th className="py-2 pr-4">Type</th>
                                            <th className="py-2 pr-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brands.map((b) => (
                                            <tr key={b.brand_id} className="border-t">
                                                <td className="py-2 pr-4">{b.brand_id}</td>
                                                <td className="py-2 pr-4">
                                                    {b.image ? <img src={b.image} className="h-10 w-10 rounded object-cover" /> : <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="py-2 pr-4">{b.brandname}</td>
                                                <td className="py-2 pr-4">{b.type || "-"}</td>
                                                <td className="py-2 pr-4 flex gap-2">
                                                    <Button className="bg-white text-black border" onClick={() => editBrand(b)}>Edit</Button>
                                                    <Button className="bg-red-600" onClick={() => deleteBrand(b.brand_id!)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </SectionCard>
                    </div>
                )}

                {/* Collections */}
                {tab === "collections" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SectionCard title={collectionEditingId ? `Edit Collection #${collectionEditingId}` : "Create Collection"}>
                            <form onSubmit={submitCollection} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Brand ID">
                                        <TextInput
                                            type="number"
                                            value={collectionForm.brand_id}
                                            onChange={(e) => setCollectionForm({ ...collectionForm, brand_id: Number(e.target.value) })}
                                            placeholder="e.g. 1"
                                            required
                                        />
                                        {collectionForm.brand_id ? (
                                            <div className="text-xs text-gray-500 mt-1">Brand: {brandMap.get(Number(collectionForm.brand_id)) || "(unknown)"}</div>
                                        ) : null}
                                    </Field>
                                    <Field label="Project ID">
                                        <TextInput
                                            type="number"
                                            value={collectionForm.project_id}
                                            onChange={(e) => setCollectionForm({ ...collectionForm, project_id: Number(e.target.value) })}
                                            placeholder="e.g. 1"
                                            required
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Main Type">
                                        <TextInput
                                            value={collectionForm.main_type}
                                            onChange={(e) => setCollectionForm({ ...collectionForm, main_type: e.target.value })}
                                            placeholder="e.g. Tile"
                                        />
                                    </Field>
                                    <Field label="Type">
                                        <TextInput
                                            value={collectionForm.type}
                                            onChange={(e) => setCollectionForm({ ...collectionForm, type: e.target.value })}
                                            placeholder="e.g. Ceramic"
                                        />
                                    </Field>
                                </div>

                                <Field label="Detail">
                                    <TextArea
                                        rows={4}
                                        value={collectionForm.detail}
                                        onChange={(e) => setCollectionForm({ ...collectionForm, detail: e.target.value })}
                                        placeholder="Description..."
                                    />
                                </Field>

                                <Field label="Image URL">
                                    <div className="flex gap-2 items-center">
                                        <TextInput
                                            value={collectionForm.image}
                                            onChange={(e) => setCollectionForm({ ...collectionForm, image: e.target.value })}
                                            placeholder="http://... or /uploads/file.png"
                                        />
                                        <input type="file" accept="image/*" onChange={(e) => onCollectionImagePick(e.target.files?.[0])} />
                                    </div>
                                </Field>
                                {collectionForm.image ? (
                                    <img src={collectionForm.image} alt="preview" className="h-20 rounded-lg border object-cover" />
                                ) : null}

                                <Field label="Collection Link">
                                    <TextInput
                                        value={collectionForm.collection_link}
                                        onChange={(e) => setCollectionForm({ ...collectionForm, collection_link: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </Field>

                                <label className="inline-flex items-center gap-2 select-none">
                                    <input
                                        type="checkbox"
                                        checked={!!collectionForm.status_discontinued}
                                        onChange={(e) => setCollectionForm({ ...collectionForm, status_discontinued: e.target.checked ? 1 : 0 })}
                                    />
                                    <span>Discontinued</span>
                                </label>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={loadingCollection}>{collectionEditingId ? "Update" : "Create"}</Button>
                                    {collectionEditingId && (
                                        <Button type="button" className="bg-gray-200 text-gray-900" onClick={() => { setCollectionEditingId(null); setCollectionForm({ brand_id: 0, project_id: 0, main_type: "", type: "", detail: "", image: "", collection_link: "", status_discontinued: 0 }); }}>Cancel</Button>
                                    )}
                                </div>
                            </form>
                        </SectionCard>

                        <SectionCard title="Collections List">
                            <div className="overflow-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="py-2 pr-4">ID</th>
                                            <th className="py-2 pr-4">Image</th>
                                            <th className="py-2 pr-4">Brand</th>
                                            <th className="py-2 pr-4">Project</th>
                                            <th className="py-2 pr-4">Type</th>
                                            <th className="py-2 pr-4">Discontinued</th>
                                            <th className="py-2 pr-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {collections.map((c) => (
                                            <tr key={c.collection_id} className="border-t">
                                                <td className="py-2 pr-4">{c.collection_id}</td>
                                                <td className="py-2 pr-4">
                                                    {c.image ? <img src={c.image} className="h-10 w-10 rounded object-cover" /> : <span className="text-gray-400">-</span>}
                                                </td>
                                                <td className="py-2 pr-4">{c.brand_id}</td>
                                                <td className="py-2 pr-4">{c.project_id}</td>
                                                <td className="py-2 pr-4">{c.type || c.main_type || "-"}</td>
                                                <td className="py-2 pr-4">{Number(c.status_discontinued) ? "Yes" : "No"}</td>
                                                <td className="py-2 pr-4 flex gap-2">
                                                    <Button className="bg-white text-black border" onClick={() => editCollection(c)}>Edit</Button>
                                                    <Button className="bg-red-600" onClick={() => deleteCollection(c.collection_id!)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </SectionCard>
                    </div>
                )}

                <div className="mt-8 text-xs text-gray-500">
                    API Base: <code>{API_BASE}</code>
                </div>
            </div>
        </div>
    );
}

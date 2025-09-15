"use client";
import { useState } from "react";
import { Brand, Collection, ProjectImage } from "./types";
import { api, uploadImage } from "./utils";

import { SectionCard, Field, Button, TextInput } from "./ui";

export default function ProjectImageAdmin({
    projectImages,
    reload,
}: {
    projectImages: ProjectImage[];
    reload: () => Promise<void>;
}) {
    const [form, setForm] = useState<ProjectImage>({ project_id: 0, image_url: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: ProjectImage = {
                project_id: Number(form.project_id),
                image_url: form.image_url || "",
            };
            if (!payload.project_id || !payload.image_url) throw new Error("project_id and image_url are required");

            if (editingId) {
                await api(`/project-images/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
            } else {
                await api(`/project-images`, { method: "POST", body: JSON.stringify(payload) });
            }

            setForm({ project_id: 0, image_url: "" });
            setEditingId(null);
            await reload();
            alert("Project Image saved");
        } catch (err: any) {
            alert(`Save failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProjectImage(id: number) {
        if (!confirm("Delete this project image?")) return;
        await api(`/project-images/${id}`, { method: "DELETE" });
        await reload();
    }

    async function onImagePick(file?: File | null) {
        if (!file) return;
        try {
            const url = await uploadImage(file);
            setForm((f) => ({ ...f, image_url: url }));
        } catch (e: any) {
            alert(`Upload failed: ${e.message}`);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <SectionCard title={editingId ? `Edit Project Image #${editingId}` : "Create Project Image"}>
                <form onSubmit={submit} className="space-y-3">
                    <Field label="Project ID">
                        <TextInput
                            type="number"
                            value={form.project_id}
                            onChange={(e) => setForm({ ...form, project_id: Number(e.target.value) })}
                            required
                        />
                    </Field>
                    <Field label="Image URL">
                        <div className="flex gap-2 items-center">
                            <TextInput
                                value={form.image_url}
                                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                            />
                            <input type="file" accept="image/*" onChange={(e) => onImagePick(e.target.files?.[0])} />
                        </div>
                    </Field>
                    {form.image_url && <img src={form.image_url} className="h-20 rounded border object-cover" />}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>{editingId ? "Update" : "Create"}</Button>
                        {editingId && (
                            <Button type="button" className="bg-gray-200 text-gray-900"
                                onClick={() => { setEditingId(null); setForm({ project_id: 0, image_url: "" }); }}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* List */}
            <SectionCard title="Project Images List">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr><th>ID</th><th>Project</th><th>Image</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {projectImages.map((pi) => (
                            <tr key={pi.image_id}>
                                <td>{pi.image_id}</td>
                                <td>{pi.project_id}</td>
                                <td>{pi.image_url ? <img src={pi.image_url} className="h-10 w-10 object-cover" /> : "-"}</td>
                                <td>
                                    <Button className="bg-white text-black border" onClick={() => { setEditingId(pi.image_id!); setForm(pi); }}>Edit</Button>
                                    <Button className="bg-red-600" onClick={() => deleteProjectImage(pi.image_id!)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </SectionCard>
        </div>
    );
}

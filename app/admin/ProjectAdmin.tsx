"use client";
import { useState } from "react";
import { Project } from "./types";
import { api } from "./utils";
import { SectionCard, Field, Button, TextInput } from "./ui";

export default function ProjectAdmin({
    projects,
    reload,
}: {
    projects: Project[];
    reload: () => Promise<void>;
}) {
    const [form, setForm] = useState<Project>({
        project_name: "",
        data_update: "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: Project = {
                project_name: form.project_name.trim(),
                data_update: form.data_update || "",
            };
            if (!payload.project_name) throw new Error("project_name is required");

            if (editingId) {
                await api(`/projects/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                await api(`/projects`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            setForm({ project_name: "", data_update: "" });
            setEditingId(null);
            await reload();
            alert("Project saved");
        } catch (err: any) {
            alert(`Save failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProject(id: number) {
        if (!confirm("Delete this project?")) return;
        await api(`/projects/${id}`, { method: "DELETE" });
        await reload();
    }

    function editProject(p: Project) {
        setEditingId(p.project_id!);
        setForm({
            project_name: p.project_name,
            data_update: p.data_update || "",
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <SectionCard
                title={editingId ? `Edit Project #${editingId}` : "Create Project"}
            >
                <form onSubmit={submit} className="space-y-3">
                    <Field label="Project Name">
                        <TextInput
                            value={form.project_name}
                            onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                            required
                        />
                    </Field>
                    <Field label="Data Update (date)">
                        <TextInput
                            type="date"
                            value={form.data_update}
                            onChange={(e) => setForm({ ...form, data_update: e.target.value })}
                        />
                    </Field>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {editingId ? "Update" : "Create"}
                        </Button>
                        {editingId && (
                            <Button
                                type="button"
                                className="bg-gray-200 text-gray-900"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm({ project_name: "", data_update: "" });
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </SectionCard>

            {/* List */}
            <SectionCard title="Projects List">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Data Update</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((p) => (
                            <tr key={p.project_id} className="border-t">
                                <td>{p.project_id}</td>
                                <td>{p.project_name}</td>
                                <td>{p.data_update || "-"}</td>
                                <td className="flex gap-2">
                                    <Button
                                        className="bg-white text-black border"
                                        onClick={() => editProject(p)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="bg-red-600"
                                        onClick={() => deleteProject(p.project_id!)}
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

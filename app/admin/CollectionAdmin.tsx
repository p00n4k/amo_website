"use client";
import { useState } from "react";
import { Collection } from "./types";

import { api, uploadImage } from "./utils";


import { SectionCard, Field, Button, TextInput, TextArea } from "./ui";

export default function CollectionAdmin({
  collections,
  reload,
  brandMap,
}: {
  collections: Collection[];
  reload: () => Promise<void>;
  brandMap: Map<number, string>;
}) {
  const [form, setForm] = useState<Collection>({
    brand_id: 0,
    project_id: 0,
    main_type: "",
    type: "",
    detail: "",
    image: "",
    collection_link: "",
    status_discontinued: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 👉 Submit handler
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Collection = {
        brand_id: Number(form.brand_id),
        project_id: Number(form.project_id),
        main_type: form.main_type || "",
        type: form.type || "",
        detail: form.detail || "",
        image: form.image || "",
        collection_link: form.collection_link || "",
        status_discontinued: Number(form.status_discontinued ? 1 : 0),
      };

      if (!payload.brand_id || !payload.project_id) {
        throw new Error("brand_id and project_id are required");
      }

      if (editingId) {
        await api(`/collections/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api(`/collections`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm({
        brand_id: 0,
        project_id: 0,
        main_type: "",
        type: "",
        detail: "",
        image: "",
        collection_link: "",
        status_discontinued: 0,
      });
      setEditingId(null);
      await reload();
      alert("Collection saved");
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // 👉 Delete
  async function deleteCollection(id: number) {
    if (!confirm("Delete this collection?")) return;
    await api(`/collections/${id}`, { method: "DELETE" });
    await reload();
  }

  // 👉 Edit
  function editCollection(c: Collection) {
    setEditingId(c.collection_id!);
    setForm({
      brand_id: Number(c.brand_id),
      project_id: Number(c.project_id),
      main_type: c.main_type || "",
      type: c.type || "",
      detail: c.detail || "",
      image: c.image || "",
      collection_link: c.collection_link || "",
      status_discontinued: Number(c.status_discontinued ? 1 : 0),
    });
  }

  // 👉 Upload image
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
      {/* ===== Form ===== */}
      <SectionCard
        title={editingId ? `Edit Collection #${editingId}` : "Create Collection"}
      >
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand ID">
              <TextInput
                type="number"
                value={form.brand_id}
                onChange={(e) =>
                  setForm({ ...form, brand_id: Number(e.target.value) })
                }
                required
              />
              {form.brand_id ? (
                <div className="text-xs text-gray-500 mt-1">
                  Brand: {brandMap.get(form.brand_id) || "(unknown)"}
                </div>
              ) : null}
            </Field>
            <Field label="Project ID">
              <TextInput
                type="number"
                value={form.project_id}
                onChange={(e) =>
                  setForm({ ...form, project_id: Number(e.target.value) })
                }
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Main Type">
              <TextInput
                value={form.main_type}
                onChange={(e) => setForm({ ...form, main_type: e.target.value })}
              />
            </Field>
            <Field label="Type">
              <TextInput
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Detail">
            <TextArea
              rows={4}
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
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
            />
          )}

          <Field label="Collection Link">
            <TextInput
              value={form.collection_link}
              onChange={(e) =>
                setForm({ ...form, collection_link: e.target.value })
              }
            />
          </Field>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.status_discontinued}
              onChange={(e) =>
                setForm({
                  ...form,
                  status_discontinued: e.target.checked ? 1 : 0,
                })
              }
            />
            <span>Discontinued</span>
          </label>

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
                  setForm({
                    brand_id: 0,
                    project_id: 0,
                    main_type: "",
                    type: "",
                    detail: "",
                    image: "",
                    collection_link: "",
                    status_discontinued: 0,
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ===== List ===== */}
      <SectionCard title="Collections List">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Brand</th>
              <th>Project</th>
              <th>Type</th>
              <th>Discontinued</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.collection_id} className="border-t">
                <td>{c.collection_id}</td>
                <td>
                  {c.image ? (
                    <img
                      src={c.image}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{brandMap.get(c.brand_id) || c.brand_id}</td>
                <td>{c.project_id}</td>
                <td>{c.type || c.main_type || "-"}</td>
                <td>{Number(c.status_discontinued) ? "Yes" : "No"}</td>
                <td className="flex gap-2">
                  <Button
                    className="bg-white text-black border"
                    onClick={() => editCollection(c)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-600"
                    onClick={() => deleteCollection(c.collection_id!)}
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

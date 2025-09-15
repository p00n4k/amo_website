"use client";
import { useEffect, useState, useMemo } from "react";
import { Brand, Collection, Project, ProjectImage } from "./types";
import { api } from "./utils";
import BrandAdmin from "./BrandAdmin";
import CollectionAdmin from "./CollectionAdmin";
import ProjectAdmin from "./ProjectAdmin";
import ProjectImageAdmin from "./ProjectImageAdmin";

export default function AdminPage() {
    const [tab, setTab] = useState<"brands" | "collections" | "projects" | "projectImages">("brands");

    // ===== State =====
    const [brands, setBrands] = useState<Brand[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);

    // ===== Loaders =====
    async function loadBrands() {
        setBrands(await api<Brand[]>("/brands"));
    }
    async function loadCollections() {
        setCollections(await api<Collection[]>("/collections"));
    }
    async function loadProjects() {
        setProjects(await api<Project[]>("/projects"));
    }
    async function loadProjectImages() {
        setProjectImages(await api<ProjectImage[]>("/project-images"));
    }

    useEffect(() => {
        loadBrands();
        loadCollections();
        loadProjects();
        loadProjectImages();
    }, []);

    // ===== Map for brand_id -> brandname =====
    const brandMap = useMemo(() => {
        const m = new Map<number, string>();
        for (const b of brands) {
            if (b.brand_id) m.set(b.brand_id, b.brandname);
        }
        return m;
    }, [brands]);

    // ===== UI =====
    return (
        <div className="p-8">
            {/* Tabs */}
            <div className="mb-6 flex gap-2">
                <button
                    className={`px-4 py-2 rounded ${tab === "brands" ? "bg-black text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("brands")}
                >
                    Brands
                </button>
                <button
                    className={`px-4 py-2 rounded ${tab === "collections" ? "bg-black text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("collections")}
                >
                    Collections
                </button>
                <button
                    className={`px-4 py-2 rounded ${tab === "projects" ? "bg-black text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("projects")}
                >
                    Projects
                </button>
                <button
                    className={`px-4 py-2 rounded ${tab === "projectImages" ? "bg-black text-white" : "bg-gray-200"}`}
                    onClick={() => setTab("projectImages")}
                >
                    Project Images
                </button>
            </div>

            {/* Panels */}
            {tab === "brands" && (
                <BrandAdmin brands={brands} reload={loadBrands} />
            )}

            {tab === "collections" && (
                <CollectionAdmin
                    collections={collections}
                    reload={loadCollections}
                    brandMap={brandMap}
                />
            )}

            {tab === "projects" && (
                <ProjectAdmin projects={projects} reload={loadProjects} />
            )}

            {tab === "projectImages" && (
                <ProjectImageAdmin
                    projectImages={projectImages}
                    reload={loadProjectImages}
                />
            )}
        </div>
    );
}

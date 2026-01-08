'use client';
import { useState, useEffect } from 'react';

// ============================
// 📦 Type Definitions
// ============================
interface Project {
  project_id: number;
  project_name: string;
  data_update: string;
  project_category: 'Residential' | 'Commercial';
  collections?: string | null; // ✅ เพิ่ม field จาก SQL JOIN
}

const tabs = ['Residential', 'Commercial'];

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState<'Residential' | 'Commercial'>('Residential');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // 🔹 Load Data from API
  // ============================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ============================
  // 🔹 Format date
  // ============================
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // ============================
  // 🔹 Filter by tab
  // ============================
  const filteredProjects = projects.filter(
    (project) => project.project_category === activeTab
  );

  // ============================
  // 🔹 UI
  // ============================
  return (
    <div className="bg-[#2d2d2d] min-h-screen text-white px-4 py-8 pt-35">
      <p className="text-sm mb-4">
        We have a diverse body of work and utilize various materials.
      </p>

      {/* --- Tabs --- */}
      <div className="flex space-x-12 mb-8 border-b border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-lg font-medium transition ${activeTab === tab
                ? 'border-b-4 border-white text-white'
                : 'text-gray-400 hover:text-gray-200'
              }`}
            onClick={() => setActiveTab(tab as 'Residential' | 'Commercial')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- Loading --- */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span className="ml-4 text-lg">Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.project_id}
              className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
            >
              {/* --- Project Image --- */}
              <div className="relative h-60 bg-gray-200">
                <img
                  src="/images/sample_project/sample_project.png"
                  alt={project.project_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* --- Project Content --- */}
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{project.project_name}</h2>
                  <a
                    href={`/projectdetail?id=${project.project_id}`}
                    className="text-blue-600 text-sm hover:text-blue-800 transition"
                  >
                    Read Full
                  </a>
                </div>

                <p className="text-sm text-gray-500">{formatDate(project.data_update)}</p>

                {/* ✅ แสดงชื่อ Collections จาก ProjectCollection */}
                {project.collections && (
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Collections:</strong> {project.collections}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;

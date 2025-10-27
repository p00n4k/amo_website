"use client";

import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import "./home.css";
import ImageSlider from "@/Components/ImageSlider";

// Interface สำหรับ Project
interface Project {
  project_id: number;
  project_name: string;
  data_update: string;
  cover_image: string | null;
  image_count: number;
  main_types: string | null;
  primary_material: string | null;
}

const Home = () => {
  // Sample images - replace with your actual image paths
  const images = [
    "/images/01_pd_focus_atlasconcorde.jpg",
    "/images/02_pd_focus_atlasconcorde.jpg",
    "/images/03_pd_focus_atlasconcorde.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch latest projects
  useEffect(() => {
    fetchLatestProjects();
  }, []);

  const fetchLatestProjects = async () => {
    try {
      const response = await fetch('/api/projects/latest');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Format date to Thai format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Handle manual navigation
  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % images.length
    );
  };

  return (
    <div>

      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Slider */}


        <div className="relative h-screen w-full">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 slider-transition ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === currentIndex}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 slider-arrow"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 slider-arrow"
          aria-label="Next slide"
        >
          →
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`slider-dot ${index === currentIndex ? "active" : "inactive"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="quote_head">
        <div className="quote_head_content">
          <h2 className="quote_head_title">
            From the beginning to the end of your home renovation or decoration process,
          </h2>
          <p className="quote_head_subtitle">
            We can assure you the satisfaction with our <span className="italic">goods and services</span>.
          </p>
          <div className="quote_head_icon">
            <span className="quote_head_text">"</span>
          </div>
        </div>
      </div>

      {/* Product Focus */}
      <div className="bg-white-600 p-8 max-w mx-auto">
        <div className="product_focus_content">
          <h2 className="product_focus_title">Product Focus</h2>

          <div className="product_focus_image">
            <div className="flex items-center mb-6">
              {/* Logo */}


              {/* Brand Name */}
              <div className="text-3xl font-bold text-gray-900">atlas concorde</div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg mb-2">
              A system of indoor & outdoor surfaces: floors, walls and decors. Since 1969
            </p>

            {/* Made in Italy */}
            <p className="text-gray-800">
              <span className="font-semibold">Made in : </span>
              <span>Italy</span>
              <ImageSlider images={images} />











            </p>
          </div>

        </div>
      </div>
      <div className="bg-gray-600 text-white py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        {/* Left Text Section */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-2xl md:text-3xl font-medium">
            Let us craft a place where trust <br /> and style come together
          </h2>
          <div className="h-0.5 w-full bg-white" />
          <p className="text-lg text-gray-300">Making your home uniquely yours.</p>
          <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded">
            View more
          </button>
        </div>

        {/* Right Project Text */}
        <div className="md:w-1/2 text-right mt-10 md:mt-0">
          <h1 className="text-6xl md:text-9xl font-bold">Project</h1>
        </div>
      </div>

      {/* Projects Section - ดึงข้อมูลจาก Database */}
      <div className="bg-gray-600 p-8 max-w mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto p-6 rounded-lg">
          {loadingProjects ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden flex animate-pulse">
                <div className="w-1/2 bg-gray-300 h-48"></div>
                <div className="w-1/2 p-5 bg-neutral-100 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : projects.length > 0 ? (
            // แสดง projects จาก database
            projects.map((project) => (
              <div key={project.project_id} className="bg-white rounded-xl shadow-md overflow-hidden flex hover:shadow-lg transition-shadow cursor-pointer">
                {/* Left Side: Image */}
                <div className="w-1/2 relative">
                  <img
                    src={project.cover_image || "/images/01_pd_focus_atlasconcorde.jpg"}
                    alt={project.project_name}
                    className="object-cover h-full w-full"
                  />
                  {project.image_count > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                      {project.image_count} photos
                    </div>
                  )}
                </div>

                {/* Right Side: Content */}
                <div className="w-1/2 p-5 bg-neutral-100">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                      <span className="font-medium">{project.project_name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(project.data_update)}</p>
                  </div>
                  <div className="text-sm space-y-2">
                    {project.main_types && (
                      <div>
                        <p className="font-semibold text-gray-700">Categories</p>
                        <p className="text-gray-500">{project.main_types}</p>
                      </div>
                    )}
                    {project.primary_material && (
                      <div>
                        <p className="font-semibold text-gray-700">Primary Material</p>
                        <p className="text-gray-500 line-clamp-2">{project.primary_material}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // ถ้าไม่มี project
            <div className="col-span-2 text-center text-white py-10">
              <p className="text-xl">No projects available</p>
            </div>
          )}
        </div>
      </div>



    </div >
  );
};

export default Home;
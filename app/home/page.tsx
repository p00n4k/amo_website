"use client";

import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import "./home.css"; 

const Home = () => {
  // Sample images - replace with your actual image paths
  const images = [
    "/images/01_pd_focus_atlasconcorde.jpg",
    "/images/02_pd_focus_atlasconcorde.jpg",
    "/images/03_pd_focus_atlasconcorde.jpg",

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Slider */}
      <div className="relative h-screen w-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 slider-transition ${
              index === currentIndex ? "opacity-100" : "opacity-0"
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


      <div className="tagline">
        <div className="tagline-top">
        From the beginning to the end <br/> 
        of your home renovation<br/> 
        </div>
        <div className="tagline-bottom">
        or decoration process, <br/>
        We can assure you the satisfaction with our goods and services.
        </div>
      </div>


    </div>
  );
};

export default Home;
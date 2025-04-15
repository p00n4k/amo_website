'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const getImage = (offset) => images[(index + offset) % images.length];

  return (
    <div className="flex justify-center items-center bg-white m p-6">
      <div className="flex w-full max-w-8\10xl h-[600px] gap-4">
        {/* Main Image */}
        <div className="relative flex-[3] rounded-[30px] overflow-hidden">
          <img
            src={getImage(0)}
            alt="Main"
            className="w-full h-full object-cover"
          />

          {/* LOG Text */}
          <div className="absolute top-6 left-6 text-white text-[120px] font-bold mix-blend-difference leading-none select-none">LOG</div>

          {/* Button and Navigation */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <button className="bg-white text-orange-500 border-2 border-orange-500 font-semibold px-6 py-2 rounded-full hover:bg-orange-50 text-sm transition">
              Take a Look Here
            </button>
            <button
              onClick={prev}
              className="bg-white border-2 border-orange-500 text-orange-500 p-3 rounded-full hover:bg-orange-50 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={next}
              className="bg-white border-2 border-orange-500 text-orange-500 p-3 rounded-full hover:bg-orange-50 transition"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Next Image */}
        <div className="flex-[1.5] rounded-[30px] overflow-hidden">
          <img
            src={getImage(1)}
            alt="Next"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-[1.5] rounded-[30px] overflow-hidden">
          <img
            src={getImage(2)}
            alt="Next"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;

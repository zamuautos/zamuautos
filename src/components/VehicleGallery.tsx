"use client";

import { useState } from "react";

type VehicleGalleryProps = {
  images: string[];
  brand: string;
  model: string;
};

export default function VehicleGallery({
  images,
  brand,
  model,
}: VehicleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (!images.length) {
    return null;
  }

  return (
    <div>
      <img
        src={selectedImage}
        alt={`${brand} ${model}`}
      className="w-[80%] h-[520px] mx-auto object-contain rounded-2xl md:w-full md:h-[650px]"
      />

  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 -mt-16 md:mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className="overflow-hidden rounded-xl"
          >
            <img
              src={image}
              alt={`${brand} ${model} foto ${index + 1}`}
              className="w-full h-24 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
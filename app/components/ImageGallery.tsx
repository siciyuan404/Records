import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div>
      <div className="mb-4">
        <Image
          src={images[selectedImage]}
          alt="Selected image"
          width={800}
          height={600}
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.slice(0, 9).map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={200}
              height={200}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ImagePreviewProps {
  images: string[];
}

export function ImagePreview({ images }: ImagePreviewProps) {
  return (
    <div className="flex space-x-2">
      {images.slice(0, 3).map((image, index) => (
        <Popover key={index}>
          <PopoverTrigger>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image src={image} alt={`Preview ${index + 1}`} width={32} height={32} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Image src={image} alt={`Full preview ${index + 1}`} width={300} height={200} />
          </PopoverContent>
        </Popover>
      ))}
      {images.length > 3 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
          +{images.length - 3}
        </div>
      )}
    </div>
  );
}
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Resource } from '@/app/sys/add/types';

// 更新 ResourceCardProps 接口
interface ResourceCardProps {
  resource: Resource;
  uuid: string;  // 单独接收 uuid
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, uuid }) => {
  const { name, images, tags, introduction, update_time } = resource;

  return (
    <Link href={`/resource/${uuid}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {images?.[0] && (
          <div className="relative aspect-video">
            <Image
              src={images[0]}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <p className="text-gray-600 mb-2 line-clamp-2">{introduction}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags?.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="bg-gray-200 rounded-full px-2 py-1 text-xs">{tag}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            更新时间：{new Date(update_time).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>

  );
};

export default ResourceCard;

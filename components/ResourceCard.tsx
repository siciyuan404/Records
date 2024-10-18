import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Resource } from '@/app/sys/add/types';


interface ResourceCardProps {
  resource: Pick<Resource, 'name' | 'images' | 'tags' | 'introduction' | 'source_links' | 'uploaded' | 'update_time' >;
  uuid: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, uuid }) => {
  return (
    <Link href={`/resource/${uuid}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <Image 
            src={resource.images[0]} 
            alt={resource.name} 
            width={400} 
            height={200} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl mb-2">{resource.name}</CardTitle>
          <p className="text-muted-foreground text-sm mb-2">{resource.introduction?.slice(0, 100)}...</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {resource.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ResourceCard;

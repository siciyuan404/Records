import React from 'react';
import { Badge } from "@/components/ui/badge"

interface TagsPreviewProps {
  tags: Record<string, any>;
}

export function TagsPreview({ tags }: TagsPreviewProps) {
  const tagEntries = Object.entries(tags);
  return (
    <div className="flex flex-wrap gap-1">
      {tagEntries.slice(0, 3).map(([key, value]) => (
        <Badge key={key} variant="secondary">{` ${value}`}</Badge>
      ))}
      {tagEntries.length > 3 && (
        <Badge variant="secondary">+{tagEntries.length - 3}</Badge>
      )}
    </div>
  );
}
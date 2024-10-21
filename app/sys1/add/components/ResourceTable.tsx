import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ResourcesState, ColumnName } from '@/app/sys/add/types'
import { ImagePreview } from './ImagePreview'
import { SourceLinksPreview } from './SourceLinksPreview'
import { formatTimeAgo } from '@/lib/utils'
import { TagsPreview } from './TagsPreview'

interface ResourceTableProps {
  resources: ResourcesState;
  visibleColumns: ColumnName[];
  onEdit: (uuid: string) => void;
  onDelete: (uuid: string) => void;
  onSelectionChange: (selectedUuids: string[]) => void;
}

export function ResourceTable({ resources, visibleColumns, onEdit, onDelete, onSelectionChange }: ResourceTableProps) {
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    const newSelectedUuids = checked ? Object.keys(resources) : [];
    setSelectedUuids(newSelectedUuids);
    onSelectionChange(newSelectedUuids);
  };

  const handleSelectOne = (uuid: string, checked: boolean) => {
    const newSelectedUuids = checked
      ? [...selectedUuids, uuid]
      : selectedUuids.filter(id => id !== uuid);
    setSelectedUuids(newSelectedUuids);
    onSelectionChange(newSelectedUuids);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20px] flex justify-center items-center">
            <Checkbox
              checked={selectedUuids.length === Object.keys(resources).length}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          {visibleColumns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(resources).map(([uuid, resource]) => (

          <TableRow key={uuid}>
            <TableCell className="w-[20px] pl-1.5">
              <div className="flex items-center justify-center w-full h-full min-h-[40px]">
                <Checkbox
                  checked={selectedUuids.includes(uuid)}
                  onCheckedChange={(checked) => handleSelectOne(uuid, checked as boolean)}
                />
              </div>
            </TableCell>
            {visibleColumns.map((column) => (
              <TableCell key={column}>

                {column === 'name' && resource.name}
                {column === 'uuid' && uuid}
                {column === 'category' && resource.category}
                {column === 'images' && <ImagePreview images={resource.images} />}
                {column === 'source_links' && <SourceLinksPreview links={resource.source_links} />}
                {column === 'tags' && (
                  <TagsPreview tags={resource.tags} />
                )}
                {column === 'uploaded' && new Date(resource.uploaded).toLocaleDateString()}
                {column === 'update_time' && formatTimeAgo(resource.update_time)}
              </TableCell>
            ))}
            <TableCell>
              <Button onClick={() => onEdit(uuid)} className="mr-2">编辑</Button>
              <Button onClick={() => onDelete(uuid)} variant="destructive">删除</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
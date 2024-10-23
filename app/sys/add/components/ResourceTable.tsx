import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ResourcesState, ColumnName } from '@/app/sys/add/types'
import { ImagePreview } from './ImagePreview'
import { SourceLinksPreview } from './SourceLinksPreview'
import { formatTimeAgo } from '@/lib/utils'
import { TagsPreview } from './TagsPreview'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  const renderCell = (column: ColumnName, resource: any, uuid: string) => {
    switch (column) {
      case 'name': return resource.name;
      case 'uuid': return uuid;
      case 'category': return resource.category;
      case 'images': return <ImagePreview images={resource.images} />;
      case 'source_links': return <SourceLinksPreview links={resource.source_links} />;
      case 'tags': return <TagsPreview tags={resource.tags} />;
      case 'uploaded': return new Date(resource.uploaded).toLocaleDateString();
      case 'update_time': return formatTimeAgo(resource.update_time);
      default: return null;
    }
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleMenuOpenChange = (uuid: string, open: boolean) => {
    setOpenMenus(prev => ({ ...prev, [uuid]: open }));
  };

  const handleEditClick = (uuid: string) => {
    onEdit(uuid);
    handleMenuOpenChange(uuid, false);
  };

  const handleDeleteClick = (uuid: string) => {
    onDelete(uuid);
    handleMenuOpenChange(uuid, false);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20px]">
              <Checkbox
                checked={selectedUuids.length === Object.keys(resources).length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            {visibleColumns.slice(0, 3).map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(resources).map(([uuid, resource]) => (
            <TableRow key={uuid}>
              <TableCell className="w-[20px]">
                <Checkbox
                  checked={selectedUuids.includes(uuid)}
                  onCheckedChange={(checked) => handleSelectOne(uuid, checked as boolean)}
                />
              </TableCell>
              {visibleColumns.slice(0, 3).map((column) => (
                <TableCell key={column}>
                  {renderCell(column, resource, uuid)}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu open={openMenus[uuid]} onOpenChange={(open) => handleMenuOpenChange(uuid, open)}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">打开菜单</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DropdownMenuItem onClick={() => handleEditClick(uuid)}>
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(uuid)}>
                      删除
                    </DropdownMenuItem>
                    {visibleColumns.slice(3).map((column) => (
                      <DropdownMenuItem key={column} onSelect={(e) => e.preventDefault()}>
                        <span className="font-medium">{column}:</span> {renderCell(column, resource, uuid)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

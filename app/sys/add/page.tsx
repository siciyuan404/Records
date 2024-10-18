"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { fetchData, syncWithGithub } from '@/lib/api'
import { ColumnVisibilityToggle } from './components/ColumnVisibilityToggle'
import { BulkOperationButtons } from './components/BulkOperationButtons'
import { ResourceTable } from './components/ResourceTable'
import { ResourceForm } from './components/ResourceForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Resource, ResourcesState, ColumnName ,ChangeRecord} from '@/app/sys/add/types'

export default function ResourceCRUD() {
  const [resources, setResources] = useState<ResourcesState>({}); // 资源数据
  const [categories, setCategories] = useState<any[]>([]); // 分类数据
  const [tags, setTags] = useState<Record<string, any>>({}); // 标签数据
  const [listData, setListData] = useState<Record<string, any>>({}); // 列表排行数据
  const [visibleColumns, setVisibleColumns] = useState<ColumnName[]>(['name', 'uuid', 'category', 'images', 'source_links', 'tags', 'uploaded', 'update_time']); // 
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);  // 
  const [editingResource, setEditingResource] = useState<{ uuid: string; resource: Resource } | null>(null);
  const { toast } = useToast();
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  const [changeRecords, setChangeRecords] = useState<ChangeRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const { resources, categories, tags, listData } = await fetchData();
      setResources(resources);
      setCategories(categories);
      setTags(tags);
      setListData(listData);
    };
    loadData();
    
  }, []);

  const handleAddResource = async (data: Resource) => {
    const uuid = crypto.randomUUID();
    const newResource = {
      ...data,
      uploaded: Date.now(),
      update_time: Date.now(),
    };
    setResources(prev => ({ ...prev, [uuid]: newResource }));
    setIsAddDialogOpen(false);
    setChangeRecords(prev => [...prev, { action: 'add', uuid, data: newResource }]);
  };

  const handleEditResource = async (uuid: string, data: Resource) => {
    const updatedResource = {
      ...data,
      update_time: Date.now(),
    };
    setResources(prev => ({ ...prev, [uuid]: updatedResource }));
    setEditingResource(null);
    setChangeRecords(prev => [...prev, { action: 'edit', uuid, data: updatedResource }]);
  };

  const handleDeleteResource = async (uuid: string) => {
    setResources(prev => {
      const newResources = { ...prev };
      delete newResources[uuid];
      return newResources;
    });
    setChangeRecords(prev => [...prev, { action: 'delete', uuid }]);
  };

  const handleSyncGithub = async () => {
    for (const record of changeRecords) {
      switch (record.action) {
        case 'add':
        case 'edit':
          await syncWithGithub(record.action, record.uuid, record.data);
          break;
        case 'delete':
          await syncWithGithub('delete', record.uuid);
          break;
        case 'bulk':
          await syncWithGithub('updateList', null, listData);
          break;
      }
    }
    await syncWithGithub('sync', null, null, resources);
    setChangeRecords([]);
    toast({
      title: "成功",
      description: "已成功同步到GitHub。",
    });
  };

  const handleBulkOperation = async (operation: string, uuids: string[]) => {
    const updatedListData = { ...listData };
    uuids.forEach(uuid => {
      if (!updatedListData[operation]) {
        updatedListData[operation] = [];
      }
      const resourceData = resources[uuid];
      if (resourceData && !updatedListData[operation].some((item: { uuid: string }) => item.uuid === uuid)) {
        updatedListData[operation].push({
          uuid,
          name: resourceData.name,
          category: resourceData.category,
          images: resourceData.images,
          tags: resourceData.tags,
          source_links: resourceData.source_links,
          uploaded: resourceData.uploaded,
          update_time: resourceData.update_time,
          introduction: resourceData.introduction,
          resource_information: resourceData.resource_information,
          link: resourceData.link,
          rating: resourceData.rating,
          comments: resourceData.comments,
          download_count: resourceData.download_count,
          download_limit: resourceData.download_limit,
          other_information: resourceData.other_information
        });
      }
    });
    setListData(updatedListData);
    setChangeRecords(prev => [...prev, { action: 'bulk', data: { operation, uuids } }]);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-5">
        <Button onClick={handleSyncGithub}>同步到GitHub</Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="">添加新资源</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>添加新资源</DialogTitle>
            </DialogHeader>
            <ResourceForm onSubmit={handleAddResource} categories={categories} tags={tags} />
          </DialogContent>
        </Dialog>
        <BulkOperationButtons
          onOperation={handleBulkOperation}
          selectedUuids={selectedUuids}
        />
        <ColumnVisibilityToggle
          columns={['uuid', 'name', 'category', 'images', 'source_links', 'tags', 'uploaded', 'update_time']}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />

      </div>

      <div className="flex justify-center mb-4">

      </div>



      <ResourceTable
        resources={resources}
        visibleColumns={visibleColumns}
        onEdit={(uuid) => setEditingResource({ uuid, resource: resources[uuid] })}
        onDelete={handleDeleteResource}
        onSelectionChange={(newSelectedUuids) => {
          setSelectedUuids(newSelectedUuids);
        }}
      />

      {editingResource && (
        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>编辑资源</DialogTitle>
            </DialogHeader>
            <ResourceForm
              initialData={editingResource.resource}
              onSubmit={(data) => handleEditResource(editingResource.uuid, data)}
              categories={categories}
              tags={tags}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
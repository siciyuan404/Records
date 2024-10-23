"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ColumnVisibilityToggle } from './components/ColumnVisibilityToggle'
import { BulkOperationButtons } from './components/BulkOperationButtons'
import { ResourceTable } from './components/ResourceTable'
import { ResourceForm } from './components/ResourceForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Resource, ResourcesState, ColumnName } from '@/app/sys/add/types'
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import { useGetTagsQuery } from '@/app/store/api/tagsApi';
import { useGetResourcesQuery } from '@/app/store/api/resourcesApi';
import { useGetListItemsQuery } from '@/app/store/api/listApi';
import { useSyncWithGithubMutation } from '@/app/store/api/githubApi';
import { useDispatch, useSelector } from 'react-redux';
import { addChangeRecord, clearChangeRecords } from '@/app/store/features/changeRecords/changeRecordsSlice';
import { RootState } from '@/app/store/store';

export default function ResourceCRUD() {
  const [resources, setResources] = useState<ResourcesState>({});
  const [visibleColumns, setVisibleColumns] = useState<ColumnName[]>(['name', 'uuid', 'category', 'images', 'source_links', 'tags', 'uploaded', 'update_time']);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<{ uuid: string; resource: Resource } | null>(null);
  const { toast } = useToast();
  const [selectedUuids, setSelectedUuids] = useState<string[]>([]);
  
  const dispatch = useDispatch();
  const changeRecords = useSelector((state: RootState) => state.changeRecords.records);

  const { data: categoriesData, refetch: refetchCategories} = useGetCategoriesQuery();
  const { data: tagsData, refetch: refetchTags} = useGetTagsQuery();
  const { data: resourcesData, refetch: refetchResources} = useGetResourcesQuery();
  const { data: listData, refetch: refetchListData } = useGetListItemsQuery();
  const [syncWithGithub] = useSyncWithGithubMutation();

  useEffect(() => {
    if (resourcesData) {
      setResources(resourcesData);
    }
  }, [resourcesData]);

  const handleAddResource = async (data: Resource) => {
    const uuid = crypto.randomUUID();
    const newResource = {
      ...data,
      uploaded: Date.now(),
      update_time: Date.now(),
    };
    setResources(prev => ({ ...prev, [uuid]: newResource }));
    setIsAddDialogOpen(false);
    dispatch(addChangeRecord({ action: 'add', uuid, data: newResource }));
  };

  const handleEditResource = async (uuid: string, data: Resource) => {
    const updatedResource = {
      ...data,
      update_time: Date.now(),
    };
    setResources(prev => ({ ...prev, [uuid]: updatedResource }));
    setEditingResource(null);
    dispatch(addChangeRecord({ action: 'edit', uuid, data: updatedResource }));
  };

  const handleDeleteResource = async (uuid: string) => {
    setResources(prev => {
      const newResources = { ...prev };
      delete newResources[uuid];
      return newResources;
    });
    dispatch(addChangeRecord({ action: 'delete', uuid }));
  };

  const handleSyncGithub = async () => {
    
    for (const record of changeRecords) {
      switch (record.action) {
        case 'add':
        case 'edit':
          await syncWithGithub({ action: record.action, uuid: record.uuid, data: record.data });
          break;
        case 'delete':
          await syncWithGithub({ action: 'delete', uuid: record.uuid });
          break;
        case 'bulk':
          await syncWithGithub({ action: 'updateList', data: listData });
          break;
      }
    }
    await syncWithGithub({ action: 'sync', data: resources });
    dispatch(clearChangeRecords());
    toast({
      title: "成功",
      description: "已成功同步到GitHub。",
    });
  };

  const handleBulkOperation = async (operation: string, uuids: string[]) => {
    dispatch(addChangeRecord({ action: 'bulk', data: { operation, uuids } }));
  };

  return (

    <div className="container mx-auto p-4">
      
      {changeRecords.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">待同步的更改：</h3>
          <details>
            <summary className="cursor-pointer">点击展开/收起详细信息</summary>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
              {JSON.stringify(changeRecords, null, 2)}
            </pre>
          </details>
        </div>
      )}
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
            
            <ResourceForm
              onSubmit={handleAddResource}
              categories={categoriesData || []}
              tags={tagsData || {}}
            />
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
              categories={categoriesData || []}
              tags={tagsData || {}}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

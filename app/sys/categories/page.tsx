"use client"

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useGetCategoriesQuery } from '@/app/store/api/categoriesApi';
import LoadingAnimation from '@/app/components/LoadingAnimation/LoadingAnimation';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select"
import Icon from '@/components/ui/icon' // 新增导入自定义 Icon 组件
import { useGetIconsQuery } from '@/app/store/api/iconsApi';

interface CategoryData {
  icon?: string
  link?: string
  items?: Record<string, CategoryData>
}

interface AddItemFormProps {
  onSubmit: (formData: { key: string; icon: string; link: string }) => void
  onCancel: () => void
  availableIcons: string[]
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onSubmit, onCancel, availableIcons }) => {
  const testAvailableIcons = ['Home', 'User', 'Settings' , 'ChevronDown', 'ChevronRight', 'Check', 'X', 'Edit', 'Trash2', 'Plus']; // 根据 lucide-react 确认实际图标名称

  const [formData, setFormData] = useState({ key: '', icon: '', link: '' })

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* debug模式 显示formData */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      {/* 已经选择的图标展示 */}
      <div className="grid grid-cols-2 gap-4">
        {formData.icon && <Icon name={formData.icon} size={24} />}
      </div>
      <Input
        type="text"
        name="key"
        value={formData.key}
        onChange={(e) => handleChange('key', e.target.value)}
        placeholder="类别名称"
        required
      />
      <Select
        name="icon"
        value={formData.icon}
        onValueChange={(value) => handleChange('icon', value)}
        required
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="选择图标" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>图标</SelectLabel>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {testAvailableIcons.map((icon) => (
                <SelectItem key={icon} value={icon}>
                  {icon}
                </SelectItem>
              ))}
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input
        type="text"
        name="link"
        value={formData.link}
        onChange={(e) => handleChange('link', e.target.value)}
        placeholder="链接"
      />
      <div className="flex justify-end space-x-2">
        <Button type="submit">添加</Button>
        <Button variant="outline" onClick={onCancel}>取消</Button>
      </div>
    </form>
  )
}

interface RecursiveTableRowProps {
  data: CategoryData
  path: string[]
  onEdit: (path: string[], newData: CategoryData) => void
  onDelete: (path: string[]) => void
  onAdd: (path: string[]) => void
  onKeyEdit: (path: string[], newKey: string) => void
}

const RecursiveTableRow: React.FC<RecursiveTableRowProps> = React.memo(({
  data,
  path,
  onEdit,
  onDelete,
  onAdd,
  onKeyEdit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(data)
  const [editedKey, setEditedKey] = useState(path[path.length - 1])

  const handleToggle = () => setIsExpanded(!isExpanded)

  const handleEdit = () => setIsEditing(true)

  const handleSave = () => {
    onEdit(path, editedData)
    onKeyEdit(path, editedKey)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }))
  }

  const hasChildren = data.items && Object.keys(data.items).length > 0

  const handleCancelEdit = () => {
    setEditedData(data);
    setEditedKey(path[path.length - 1]);
    setIsEditing(false);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center space-x-2" style={{ marginLeft: `${path.length * 10}px` }}>
            {hasChildren && (
              <Button variant="ghost" size="sm" onClick={handleToggle} className="p-1">
                {isExpanded ? <Icon name="ChevronDown" size={14} /> : <Icon name="ChevronRight" size={14} />}
              </Button>
            )}
            {!hasChildren && <span className="w-4"></span>}
            {isEditing ? (
              <Input
                value={editedKey}
                onChange={(e) => setEditedKey(e.target.value)}
                className="w-full max-w-[120px]"
              />
            ) : (
              <span className="truncate max-w-[120px]">{path[path.length - 1]}</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          {isEditing ? (
            <Input
              value={editedData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              className="w-full max-w-[80px]"
            />
          ) : (
            data.icon && <Icon name={data.icon} size={14} />
          )}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {isEditing ? (
            <Input
              value={editedData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              className="w-full max-w-[120px]"
            />
          ) : (
            <span className="truncate max-w-[120px]">{data.link}</span>
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <div className="flex space-x-1">
              <Button size="sm" onClick={handleSave}><Icon name="Check" size={14} /></Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}><Icon name="X" size={14} /></Button>
            </div>
          ) : (
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" onClick={handleEdit}><Icon name="Edit" size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(path)}><Icon name="Trash2" size={14} /></Button>
              <Button variant="ghost" size="sm" onClick={() => onAdd(path)}><Icon name="Plus" size={14} /></Button>
            </div>
          )}
        </TableCell>
      </TableRow>
      {isExpanded && hasChildren && Object.entries(data.items!).map(([key, value]) => (
        <RecursiveTableRow
          key={key}
          data={value}
          path={[...path, key]}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdd={onAdd}
          onKeyEdit={onKeyEdit}
        />
      ))}
    </>
  )
})

const CRUDTable: React.FC = () => {
  const [data, setData] = useState<Record<string, CategoryData>>({})
  const { data: categoriesData, isLoading, isError } = useGetCategoriesQuery();
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const githubApiToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const { toast } = useToast()
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const { data: iconsData, isLoading: iconsLoading, isError: iconsError } = useGetIconsQuery();

  useEffect(() => {
    if (categoriesData) {
      setData(categoriesData)
    }
  }, [categoriesData])

  useEffect(() => {
    if (iconsData) {
      setAvailableIcons(iconsData);
    }
  }, [iconsData]);

  if (isError) {
    toast({
      title: "错误",
      description: "获取数据失败",
      variant: "destructive",
    });
  }

  const handleEdit = (path: string[], newData: CategoryData) => {
    setData(prevData => {
      const updatedData = { ...prevData }
      let current = updatedData
      for (let i = 0; i < path.length - 1; i++) {
        current = (current as any)[path[i]]?.items || (current as any)[path[i]]
      }
      if (typeof current === 'object' && path[path.length - 1] in current) {
        delete (current as Record<string, CategoryData>)[path[path.length - 1]]
      }
      current[path[path.length - 1]] = newData as Record<string, CategoryData>;
      return updatedData
    })
  }

  const handleKeyEdit = (path: string[], newKey: string) => {
    setData(prevData => {
      const updatedData = { ...prevData }
      let current = updatedData
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] && current[path[i]].items) {
          current = current[path[i]].items!
        } else {
          return prevData
        }
      }
      if (current[path[path.length - 1]] && path[path.length - 1] !== newKey) {
        current[newKey] = current[path[path.length - 1]]
        delete current[path[path.length - 1]]
      }
      return updatedData
    })
  }

  const handleDelete = (path: string[]) => {
    setData(prevData => {
      const updatedData = { ...prevData }
      let current = updatedData
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] && 'items' in current[path[i]]) {
          current = current[path[i]].items as Record<string, CategoryData>;
        } else {
          current = current[path[i]] as Record<string, CategoryData>;
        }
      }
      delete current[path[path.length - 1]]
      return updatedData
    })
  }

  const handleAdd = (path: string[]) => {
    setCurrentPath(path)
    setShowAddForm(true)
  }

  const handleAddSubmit = (formData: { key: string; icon: string; link: string }) => {
    setData(prevData => {
      const updatedData = { ...prevData }
      let current = updatedData
      for (let i = 0; i < currentPath.length; i++) {
        if (!current[currentPath[i]]) {
          current[currentPath[i]] = {}
        }
        if (!current[currentPath[i]].items) {
          current[currentPath[i]].items = {}
        }
        current = current[currentPath[i]].items!
      }
      current[formData.key] = { icon: formData.icon, link: formData.link }
      return updatedData
    })
    setShowAddForm(false)
  }

  const handleSave = async () => {
    try {
      const { sha, content: currentContent } = await getLatestFileContent()

      const newContent = JSON.stringify(data, null, 2)
      if (currentContent === newContent) {
        toast({
          title: "提示",
          description: "没有变更需要保存",
        })
        return
      }

      const encodedContent = btoa(unescape(encodeURIComponent(newContent)))

      const response = await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/db.json`,
        {
          message: 'Update db.json via admin dashboard',
          content: encodedContent,
          sha: sha,
          branch: 'master'
        },
        {
          headers: {
            Authorization: `token ${githubApiToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      toast({
        title: "成功",
        description: "数据已成功保存到 GitHub 的 master 分支",
      })
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast({
          title: "错误",
          description: "保存失败：文件已被其他人修改。请刷新页面获取最新内容后再试。",
          variant: "destructive",
        })
      } else {
        console.error('Error saving data:', error)
        toast({
          title: "错误",
          description: "保存数据时出错，请查看控制台以获取更多信息",
          variant: "destructive",
        })
      }
    }
  }

  const getLatestFileContent = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/src/db/db.json?ref=master`,
        {
          headers: {
            Authorization: `token ${githubApiToken}`
          }
        }
      )
      const content = atob(response.data.content)
      return { sha: response.data.sha, content }
    } catch (error) {
      console.error('Error getting latest file content:', error)
      throw error
    }
  }

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">类目树</h1>
      

      <Button className="mb-4 text-sm" onClick={() => setShowAddForm(true)}>
        添加新分类
      </Button>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">类别</TableHead>
              <TableHead className="w-1/6">图标</TableHead>
              <TableHead className="w-1/3 hidden sm:table-cell">链接</TableHead>
              <TableHead className="w-1/6">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data).map(([key, value]) => (
              <RecursiveTableRow
                key={key}
                data={value}
                path={[key]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
                onKeyEdit={handleKeyEdit}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Button className="mt-4 text-sm" onClick={handleSave}>
        <Icon name="Save" size={14} className="mr-2" /> 保存到 GitHub
      </Button>
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新项目</DialogTitle>
          </DialogHeader>
          <AddItemForm
            onSubmit={handleAddSubmit}
            onCancel={() => setShowAddForm(false)}
            availableIcons={iconsLoading ? [] : availableIcons}
          />
        </DialogContent>
      </Dialog>
    {process.env.NODE_ENV === 'development' && (
      <div className="mt-8 flex space-x-4">
        <div className="w-1/2 p-4 bg-gray-100 rounded-lg">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="mb-2">
                <Icon name="ChevronDown" size={16} className="h-4 w-4 mr-2" />
                展开/折叠调试信息
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <h2 className="text-xl font-bold mb-2">调试信息：data</h2>
              <pre className="whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(data, null, 2)}
                {JSON.stringify(availableIcons, null, 2)}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    )}
    </div>
  )
}

const CategoriesPage = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <CRUDTable />
    </Suspense>
  );
};

export default CategoriesPage

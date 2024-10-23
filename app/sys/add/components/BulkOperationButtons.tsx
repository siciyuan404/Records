import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface BulkOperationButtonsProps { // 批量操作按钮
  onOperation: (operation: string, selectedUuids: string[]) => void; // onOperation 接收一个函数，函数接收一个字符串作为参数
  selectedUuids: string[];
}

export function BulkOperationButtons({ onOperation, selectedUuids }: BulkOperationButtonsProps) { 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedOperations, setSelectedOperations] = useState<string[]>([]);

  const operations = [
    { key: 'recommend', label: '上传推荐列表' },
    { key: 'hot', label: '上传热门列表' },
    { key: 'top', label: '上传置顶列表' },
    { key: 'latest', label: '上传最新列表' },
    
    { key: 'unrecommend', label: '移除推荐列表' },
    { key: 'unhot', label: '移除热门列表' },
    { key: 'untop', label: '移除置顶列表' },
    { key: 'unlatest', label: '移除最新列表' },
    
    { key: 'delete', label: '批量删除' },
  ];

  return (
    <div>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={selectedUuids.length === 0}
      >
        批量操作
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择批量操作</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {operations.map((operation) => (
              <div key={operation.key} className="flex items-center">
                <Checkbox
                  id={operation.key}
                  checked={selectedOperations.includes(operation.key)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedOperations([...selectedOperations, operation.key]);
                    } else {
                      setSelectedOperations(selectedOperations.filter(key => key !== operation.key));
                    }
                  }}
                />
                <label htmlFor={operation.key} className="ml-2">
                  {operation.label}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => {
              if (selectedOperations.length > 0) {
                setIsConfirmDialogOpen(true);
              } else {
                setIsDialogOpen(false);
              }
            }}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认添加任务</DialogTitle>
          </DialogHeader>
          <p>您确定要执行以下操作吗？</p>
          <ul>
            {selectedOperations.map((key) => (
              <li key={key}>{operations.find(op => op.key === key)?.label}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button onClick={() => {
              selectedOperations.forEach(key => onOperation(key, selectedUuids));
              setIsConfirmDialogOpen(false);
              setIsDialogOpen(false);
              setSelectedOperations([]);
            }}>
              确认
            </Button>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

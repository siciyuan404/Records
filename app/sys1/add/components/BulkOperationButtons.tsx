import React from 'react';
import { Button } from "@/components/ui/button"

interface BulkOperationButtonsProps { // 批量操作按钮
  onOperation: (operation: string, selectedUuids: string[]) => void; // onOperation 接收一个函数，函数接收一个字符串作为参数
  selectedUuids: string[];
}

export function BulkOperationButtons({ onOperation, selectedUuids }: BulkOperationButtonsProps) { 
  const operations = [
    { key: 'recommend', label: '推荐' },
    { key: 'hot', label: '热门' },
    { key: 'top', label: '置顶' },
    { key: 'latest', label: '最新' },
    { key: 'delete', label: '删除' },
  ];

  return (
    <div className="flex space-x-2">
      {operations.map((operation) => (
        <Button 
          key={operation.key} 
          onClick={() => onOperation(operation.key, selectedUuids)}
          disabled={selectedUuids.length === 0}
        >   
          {operation.label} 
        </Button>
      ))}
    </div>
  )
}
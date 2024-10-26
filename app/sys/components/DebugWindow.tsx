import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Draggable from 'react-draggable'

// 新增导入 DataTable 组件（假设你将使用自定义的表格组件）
import DataTable from '@/app/components/ui/DataTable'

const DebugWindow: React.FC = () => {
  const storeData = useSelector((state: RootState) => state)

  return (
    <Draggable>
      <Card className="h-full w-1/4 bg-white border overflow-auto p-4 shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-bold mb-4">调试窗口</h2>
        </CardHeader>
        <CardContent>
          {/* 使用 DataTable 组件代替 CollapsibleJson */}
          <DataTable data={storeData} />
        </CardContent>
      </Card>
    </Draggable>
  )
}

export default DebugWindow

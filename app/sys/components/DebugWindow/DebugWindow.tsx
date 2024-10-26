import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import DataTable from '@/app/components/ui/DataTable'
import './DebugWindow.module.css' // 样式导入
import Draggable from 'react-draggable' // 确保已导入

const DebugWindow: React.FC = () => {
  const storeData = useSelector((state: RootState) => state)
  const [width, setWidth] = useState(600) // 将初始宽度从 300 增加到 600
  const [height, setHeight] = useState(600) // 新增初始高度
  const [collapsed, setCollapsed] = useState(true) // 默认收起
  const resizerRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true
    document.addEventListener('mousemove', resize)
    document.addEventListener('mouseup', stopResizing)
  }

  const resize = (e: MouseEvent) => {
    if (isResizing.current && resizerRef.current) {
      const newWidth = e.clientX - resizerRef.current.getBoundingClientRect().left
      const newHeight = e.clientY - resizerRef.current.getBoundingClientRect().top
      if (newWidth > 300 && newWidth < 1200) { // 增大最小和最大宽度限制
        setWidth(newWidth)
      }
      if (newHeight > 300 && newHeight < 1000) { // 新增高度调整限制
        setHeight(newHeight)
      }
    }
  }

  const stopResizing = () => {
    isResizing.current = false
    document.removeEventListener('mousemove', resize)
    document.removeEventListener('mouseup', stopResizing)
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const showDebugWindow = () => {
    setCollapsed(false)
  }

  const hideDebugWindow = () => {
    setCollapsed(true)
  }

  return (
    <>
      {collapsed ? (
        <Button
          className="debug-toggle-button"
          onClick={showDebugWindow}
        >
          显示调试窗口
        </Button>
      ) : (
        <Draggable handle=".drag-handle">
          <div
            className={`debug-window-container ${collapsed ? 'collapsed' : ''}`}
            style={{ width, height }} // 应用宽度和高度
          >
            <Card className="h-full bg-white border overflow-auto p-4 shadow-lg">
              <CardHeader className="flex justify-between items-center drag-handle cursor-move">
                <h2 className="text-xl font-bold">调试窗口</h2>
                <Button variant="ghost" size="sm" onClick={toggleCollapse} className="p-0">
                  {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </CardHeader>
              {!collapsed && (
                <CardContent>
                  <DataTable data={storeData} />
                </CardContent>
              )}
            </Card>
            {!collapsed && (
              <div
                ref={resizerRef}
                className="resizer"
                onMouseDown={startResizing}
              />
            )}
            <Button
              className="debug-hide-button"
              onClick={hideDebugWindow}
            >
              关闭调试窗口
            </Button>
          </div>
        </Draggable>
      )}
    </>
  )
}

export default DebugWindow

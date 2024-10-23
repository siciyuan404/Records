import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ColumnName } from '@/app/sys/add/types'

interface ColumnVisibilityToggleProps {
  columns: ColumnName[];
  visibleColumns: ColumnName[];
  setVisibleColumns: (columns: ColumnName[]) => void;
  useSmallScreen?: boolean;
  children?: React.ReactNode;
}

export function ColumnVisibilityToggle({ 
  columns, 
  visibleColumns, 
  setVisibleColumns, 
  useSmallScreen = false,
  children 
}: ColumnVisibilityToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (column: ColumnName) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter(c => c !== column));
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  const content = (
    <div className="space-y-2">
      {columns.map(column => (
        <div key={column} className="flex items-center space-x-2">
          <Checkbox
            id={column}
            checked={visibleColumns.includes(column)}
            onCheckedChange={() => handleToggle(column)}
          />
          <label htmlFor={column}>{column}</label>
        </div>
      ))}
    </div>
  );

  if (useSmallScreen) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>显示列</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)}>显示列</Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-10">
          {content}
        </div>
      )}
    </div>
  );
}

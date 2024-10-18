import React from 'react';
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnName } from '@/app/sys/add/types'

interface ColumnVisibilityToggleProps {
  columns: ColumnName[];
  visibleColumns: ColumnName[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<ColumnName[]>>;
}

export function ColumnVisibilityToggle({ columns, visibleColumns, setVisibleColumns }: ColumnVisibilityToggleProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">显示列</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {columns.map((column) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={visibleColumns.includes(column)}
                onCheckedChange={(checked) => {
                  setVisibleColumns(
                    checked
                      ? [...visibleColumns, column]
                      : visibleColumns.filter((c) => c !== column)
                  )
                }}
              />
              <label
                htmlFor={column}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
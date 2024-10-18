import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from 'lucide-react'

interface KeyValueInputProps {
  value: Record<string, string | number>;
  onChange: (value: Record<string, string | number>) => void;
  title: string;
}

export function KeyValueInput({ value, onChange, title }: KeyValueInputProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddItem = () => {
    if (newKey && newValue) {
      onChange({ ...value, [newKey]: newValue });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveItem = (key: string) => {
    const newValue = { ...value };
    delete newValue[key];
    onChange(newValue);
  };

  const handleChangeValue = (key: string, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  return (
    <div className="space-y-4">
      <Label>{title}</Label>
      {Object.entries(value).map(([key, val]) => (
        <div key={key} className="flex items-center space-x-2">
          <Input
            value={key}
            readOnly
            className="w-1/3"
          />
          <Input
            value={val}
            onChange={(e) => handleChangeValue(key, e.target.value)}
            className="w-1/2"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveItem(key)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex items-end space-x-2">
        <div className="space-y-2 w-1/3">
          <Input
            id="new-key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
        </div>
        <div className="space-y-2 w-1/2">
          <Input
            id="new-value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </div>
        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!newKey || !newValue}
        >
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>
    </div>
  );
}
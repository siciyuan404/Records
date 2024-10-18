import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryItem {
  icon: string;
  link: string;
  items?: Record<string, CategoryItem>;
}

type Categories = Record<string, CategoryItem>; 

interface CascaderProps {
  categories: Categories;
  value: string;
  onChange: (value: string) => void;
}

export function Cascader({ categories, value, onChange }: CascaderProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(value ? value.split(' > ') : []);

  useEffect(() => {
    setSelectedCategories(value ? value.split(' > ') : []);
  }, [value]);

  const handleCategorySelect = (level: number, selectedValue: string) => {
    const newSelectedCategories = [...selectedCategories.slice(0, level), selectedValue];
    setSelectedCategories(newSelectedCategories);
    const categoryString = newSelectedCategories.join(' > ');
    onChange(categoryString);
  };

  const getSubcategories = (level: number): string[] => {
    let currentCategories: Categories | undefined = categories;
    for (let i = 0; i < level; i++) {
      if (currentCategories && selectedCategories[i]) {
        currentCategories = currentCategories[selectedCategories[i]]?.items;
      } else {
        return [];
      }
    }
    return currentCategories ? Object.keys(currentCategories) : [];
  };

  const hasMoreLevels = (level: number): boolean => {
    let currentCategories: Categories | undefined = categories;
    for (let i = 0; i <= level; i++) {
      if (currentCategories && selectedCategories[i]) {
        currentCategories = currentCategories[selectedCategories[i]]?.items;
      } else {
        return false;
      }
    }
    return !!currentCategories && Object.keys(currentCategories).length > 0;
  };

  const renderSelect = (level: number) => {
    const subcategories = getSubcategories(level);
    if (subcategories.length === 0 && level > 0) return null;

    return (
      <Select
        key={level}
        value={selectedCategories[level] || ''}
        onValueChange={(value) => handleCategorySelect(level, value)}
        disabled={level > 0 && !selectedCategories[level - 1]}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Level ${level + 1}`} />
        </SelectTrigger>
        <SelectContent>
          {subcategories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {selectedCategories.map((_, index) => renderSelect(index))}
      {renderSelect(selectedCategories.length)}
      {hasMoreLevels(selectedCategories.length - 1) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => handleCategorySelect(selectedCategories.length, '')}
        >
          Add Level
        </Button>
      )}
    </div>
  );
}
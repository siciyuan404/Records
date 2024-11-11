  // app/types.ts
  export interface CategoryData {
    icon: string;
    link: string;
    items?: Record<string, CategoryData>;
  }
export interface Resource {
    name: string;
    category: string;
    images: string[];
    tags: Record<string, any>;
    source_links: Record<string, { link: string; psw: string; size: string }>;
    uploaded: number;
    update_time: number;
    introduction?: string;
    resource_information?: Record<string, string | number>;
    link?: string;
    rating?: number;
    comments?: number;
    download_count?: number;
    download_limit?: number;
    other_information?: Record<string, string | number>;
  }
  
  export interface ResourcesState {
    [uuid: string]: Resource;
  }
  
  export interface Categories {
    [key: string]: {
      icon: string;
      link: string;
      items?: Categories;
    };
  }
  
  export type ColumnName = 'name' | 'uuid' | 'category' | 'images' | 'source_links' | 'tags' | 'uploaded' | 'update_time';

export interface ChangeRecord {
  action: 'add' | 'edit' | 'delete' | 'bulk';
  uuid?: string;
  data?: any;
  listChanges?: string[];
}



// app/admin/types.ts

// Brand type
export type Brand = {
  brand_id?: number;
  brandname: string;
  type?: string;
  image?: string;
};

// Collection type
export type Collection = {
  collection_id?: number;
  brand_id: number;
  project_id: number;
  main_type?: string;
  type?: string;
  detail?: string;
  image?: string;
  collection_link?: string;
  status_discontinued?: boolean | number;
};

// ProjectImage type
export type ProjectImage = {
  image_id?: number;
  project_id: number;
  image_url: string;
};

// Project table type
export type Project = {
  project_id?: number;
  project_name: string;
  data_update?: string;
};

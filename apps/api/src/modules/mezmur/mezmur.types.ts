type Mezmur = {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  thumbnailUrl?: string;
  thumbnailStorageId?: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  fileName: string;
  uploadedById: number;
  createdAt: Date;
  updatedAt: Date;
};

type MezmurCategory = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export { Mezmur, MezmurCategory };
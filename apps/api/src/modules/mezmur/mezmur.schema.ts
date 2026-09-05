import z from "zod";

export const MezmurSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().max(255),
  description: z.string().max(255).optional(),
  categoryId: z.number().int().positive(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailStorageId: z.string().uuid().optional(),
  storagePath: z.string().max(255),
  mimeType: z.string().max(100),
  fileSize: z.number().int().positive(),
  fileName: z.string().max(255),
  uploadedById: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const MezmurCategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(100),
  description: z.string().max(500),
});

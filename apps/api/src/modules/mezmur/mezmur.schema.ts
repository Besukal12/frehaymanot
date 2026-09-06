import z from "zod";

export const MezmurSchema = z.object({
  title: z.string().max(255),
  description: z.string().max(255).optional(),
  categoryId: z.number().int().positive(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailStorageId: z.string().uuid().optional(),
  pdfUrl: z.string().url().optional(),
  pdfStorageId: z.string().uuid().optional(),
});

export const MezmurCategorySchema = z.object({
  name: z.string().max(100),
  description: z.string().max(500),
});

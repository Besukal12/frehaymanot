import z from "zod";

export const MezmurSchema = z.object({
  title: z.string().max(255),
  description: z.string().max(255).optional(),
  categoryId: z.coerce.number().int().positive(),
});

export const MezmurCategorySchema = z.object({
  name: z.string().max(100),
  description: z.string().max(500),
});

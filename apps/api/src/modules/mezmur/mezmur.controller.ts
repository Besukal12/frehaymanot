import { Request, Response } from "express";
import { Mezmur, MezmurCategory } from "./mezmur.types";
import { MezmurSchema, MezmurCategorySchema } from "./mezmur.schema";
import { prisma } from "../../config/prisma.js";

export async function mezmurCategory(req: Request, res: Response) {
  try {
    const categories: MezmurCategory = MezmurCategorySchema.safeParse(req.body);

    if (!categories.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const { name: name, descripton: description }: MezmurCategory =
      categories.data;

    const newCategory = await prisma.MezmurCategory.create({
      data: {
        name: name,
        description: description,
      },
    });

    return res.status(200).json({
      message: "Category created successfully.",
      category: {
        name: newCategory.name,
        description: newCategory.description,
      },
    });
  } catch (error) {}
}

export async function addMezmur(req: Request, res: Response) {
  try {
    const mezmurData: Mezmur = MezmurSchema.safeParse(req.body);

    if (!mezmurData.success) {
      return res.status(400).json({
        message: "Invalid input",
      });
    }

    const {
      title: title,
      description: description,
      categoryId: categoryId,
      thumbnailUrl: thumbnailUrl,
      thumbnailStorageId: thumbnailStorageId,
      storagePath: storagePath,
      mimeType: mimeType,
      fileSize: fileSize,
      fileName: fileName,
      uploadedById: uploadedById,
    }: Mezmur = mezmurData.data;
  } catch (error) {}
}

import { Request, Response } from "express";
import { MezmurSchema, MezmurCategorySchema } from "./mezmur.schema.js";
import { prisma } from "../../config/prisma.js";
import { getAuth } from "@clerk/express";
import {
  validateFileType,
  uploadToCloudinary,
} from "../../middleware/upload/uploadToCloudinary.js";
import cloudinary from "../../config/cloudinary.js";

// add mezmur and mezmur category
export async function addCategory(req: Request, res: Response) {
  try {
    const categories = MezmurCategorySchema.safeParse(req.body);

    if (!categories.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: categories.error.flatten(),
      });
    }

    const { name, description } = categories.data;

    const newCategory = await prisma.mezmurCategory.create({
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
  } catch (error) {
    console.error("Add category error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function addMezmur(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const mezmurData = MezmurSchema.safeParse(req.body);

    if (!mezmurData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: mezmurData.error.flatten(),
      });
    }

    const { title, description, categoryId } = mezmurData.data;

    const category = await prisma.mezmurCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const files = (req.files ?? {}) as {
      thumbnail?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
    };

    const thumbnail = files.thumbnail?.[0];
    const pdf = files.pdf?.[0];

    if (!thumbnail || !pdf) {
      return res.status(400).json({
        message: "Thumbnail and PDF are required",
      });
    }

    const thumbnailType = await validateFileType(thumbnail.buffer);
    const pdfType = await validateFileType(pdf.buffer);

    if (!thumbnailType.startsWith("image/")) {
      return res.status(400).json({
        message: "Thumbnail must be an image",
      });
    }

    if (pdfType !== "application/pdf") {
      return res.status(400).json({
        message: "File must be a PDF",
      });
    }

    const uploadedThumbnail = await uploadToCloudinary(
      thumbnail.buffer,
      thumbnailType,
    );

    const uploadedPdf = await uploadToCloudinary(pdf.buffer, pdfType);

    const newMezmur = await prisma.mezmur.create({
      data: {
        title: title,
        description: description,
        categoryId: categoryId,

        thumbnailUrl: uploadedThumbnail.secure_url,
        thumbnailStorageId: uploadedThumbnail.public_id,

        pdfUrl: uploadedPdf.secure_url,
        pdfStorageId: uploadedPdf.public_id,

        uploadedById: userId,
      },
    });

    return res.status(201).json({
      message: "Mezmur created successfully",
      mezmur: newMezmur,
    });
  } catch (error) {
    console.error("Add mezmur error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

//get mezmur and mezmur category
export async function getCategory(req: Request, res: Response) {
  try {
    const categories = await prisma.mezmurCategory.findMany();

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories: categories,
    });
  } catch (error) {
    console.error("Get mezmur category error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getMezmur(req: Request, res: Response) {
  try {
    const mezmurs = await prisma.mezmur.findMany({
      include: {
        category: true,
      },
    });

    return res.status(200).json({
      message: "Mezmurs retrieved successfully",
      mezmurs: mezmurs,
    });
  } catch (error) {
    console.error("Get mezmur error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getMezmurById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const mezmur = await prisma.mezmur.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
      },
    });

    if (!mezmur) {
      return res.status(404).json({
        message: "Mezmur not found",
      });
    }

    return res.status(200).json({
      message: "Mezmur retrieved successfully",
      mezmur: mezmur,
    });
  } catch (error) {
    console.error("Get mezmur by ID error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

//delete mezmur and mezmur category
export async function deleteCategory(req: Request, res: Response) {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(404).json({
        message: "Invalid category ID",
      });
    }

    const category = await prisma.mezmurCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await prisma.mezmurCategory.delete({
      where: {
        id: categoryId,
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteMezmur(req: Request, res: Response) {
  try {
    const { userId, orgRole } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const mezmurId = Number(req.params.id);

    if (!Number.isInteger(mezmurId) || mezmurId <= 0) {
      return res.status(404).json({
        message: "Invalid mezmur ID",
      });
    }

    const mezmur = await prisma.mezmur.findUnique({
      where: {
        id: mezmurId,
      },
    });

    if (!mezmur) {
      return res.status(404).json({
        message: "Mezmur not found",
      });
    }

    const isOwner = mezmur.uploadedById === userId;
    const isAdmin = orgRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to delete this mezmur.",
      });
    }

    if (mezmur.thumbnailStorageId) {
      await cloudinary.uploader.destroy(mezmur.thumbnailStorageId, {
        resource_type: "image",
      });
    }

    if (mezmur.pdfStorageId) {
      await cloudinary.uploader.destroy(mezmur.pdfStorageId, {
        resource_type: "raw",
      });
    }

    await prisma.mezmur.delete({
      where: {
        id: mezmurId,
      },
    });

    return res.status(200).json({
      message: "Mezmur deleted successfully",
      mezmur,
    });
  } catch (error) {
    console.error("Delete mezmur error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

//update mezmur and mezmur category
export async function updateCategory(req: Request, res: Response) {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(404).json({
        message: "Invalid category ID",
      });
    }

    const category = await prisma.mezmurCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "There is no category with that id.",
      });
    }

    const safeData = MezmurCategorySchema.partial().safeParse(req.body);

    if (!safeData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: safeData.error.flatten(),
      });
    }

    const updatedCategory = await prisma.mezmurCategory.update({
      where: {
        id: categoryId,
      },
      data: safeData.data,
    });

    return res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateMezmur(req: Request, res: Response) {
  try {
    const { userId, orgRole } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const mezmurId = Number(req.params.id);

    if (!Number.isInteger(mezmurId) || mezmurId <= 0) {
      return res.status(404).json({
        message: "Invalid mezmur ID",
      });
    }

    const mezmur = await prisma.mezmur.findUnique({
      where: {
        id: mezmurId,
      },
    });

    if (!mezmur) {
      return res.status(404).json({
        message: "Mezmur not found",
      });
    }

    const isOwner = mezmur.uploadedById === userId;
    const isAdmin = orgRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to update this mezmur.",
      });
    }

    const safeData = MezmurSchema.partial().safeParse(req.body);

    if (!safeData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: safeData.error.flatten(),
      });
    }

    const { title, description, categoryId } = safeData.data;

    if (categoryId !== undefined) {
      const category = await prisma.mezmurCategory.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    }

    const files = (req.files ?? {}) as {
      thumbnail?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
    };

    const thumbnail = files.thumbnail?.[0];
    const pdf = files.pdf?.[0];

    const updateData: Record<string, unknown> = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
    };

    let oldThumbnailStorageId: string | null = null;
    let oldPdfStorageId: string | null = null;

    if (thumbnail) {
      const thumbnailType = await validateFileType(thumbnail.buffer);

      if (!thumbnailType.startsWith("image/")) {
        return res.status(400).json({
          message: "Thumbnail must be an image",
        });
      }

      const uploadedThumbnail = await uploadToCloudinary(
        thumbnail.buffer,
        thumbnailType,
      );

      updateData.thumbnailUrl = uploadedThumbnail.secure_url;
      updateData.thumbnailStorageId = uploadedThumbnail.public_id;
      oldThumbnailStorageId = mezmur.thumbnailStorageId;
    }

    if (pdf) {
      const pdfType = await validateFileType(pdf.buffer);

      if (pdfType !== "application/pdf") {
        return res.status(400).json({
          message: "File must be a PDF",
        });
      }

      const uploadedPdf = await uploadToCloudinary(pdf.buffer, pdfType);

      updateData.pdfUrl = uploadedPdf.secure_url;
      updateData.pdfStorageId = uploadedPdf.public_id;
      oldPdfStorageId = mezmur.pdfStorageId;
    }

    const updatedMezmur = await prisma.mezmur.update({
      where: {
        id: mezmurId,
      },
      data: updateData,
    });

    // Clean up old files only after the DB write succeeds
    if (oldThumbnailStorageId) {
      await cloudinary.uploader.destroy(oldThumbnailStorageId, {
        resource_type: "image",
      });
    }

    if (oldPdfStorageId) {
      await cloudinary.uploader.destroy(oldPdfStorageId, {
        resource_type: "raw",
      });
    }

    return res.status(200).json({
      message: "Mezmur updated successfully",
      mezmur: updatedMezmur,
    });
  } catch (error) {
    console.error("Update mezmur error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

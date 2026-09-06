import { Request, Response } from "express";
import { MezmurSchema, MezmurCategorySchema } from "./mezmur.schema.js";
import { prisma } from "../../config/prisma.js";
import { getAuth } from "@clerk/express";
import {
  validateFileType,
  uploadToCloudinary,
} from "../../middleware/upload/uploadToCloudinary.js";

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
    // const { userId } = getAuth(req);

    // if (!userId) {
    //   return res.status(401).json({
    //     message: "Unauthorized",
    //   });
    // }

    const userId = "besukal";

    const mezmurData = MezmurSchema.safeParse(req.body);

    if (!mezmurData.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: mezmurData.error.flatten(),
      });
    }

    const {
      title: title,
      description: description,
      categoryId: categoryId,
    } = mezmurData.data;

    // const category = await prisma.mezmurCategory.findUnique({
    //   where: {
    //     id: categoryId,
    //   },
    // });

    // if (!category) {
    //   return res.status(404).json({
    //     message: "Category not found",
    //   });
    // }

    const category = 1;

    const files = req.files as {
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
        title: mezmurData.data.title,
        description: mezmurData.data.description,
        categoryId: mezmurData.data.categoryId,

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

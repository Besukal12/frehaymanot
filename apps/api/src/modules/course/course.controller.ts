import { Request, Response } from "express";
import {prisma} from "../../config/prisma.js"
import { getAuth } from "@clerk/express";
import {
  validateFileType,
  uploadToCloudinary,
} from "../../middleware/upload/uploadToCloudinary.js";


import multer from "multer";
import { FileFilterCallback } from "multer";
import { Request } from "express";
import { fileTypeFromBuffer } from "file-type";
import cloudinary from "../../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg",
  "image/tiff",
  "image/jpg",
];
const allowedPdfTypes = ["application/pdf", "application/octet-stream"];
const genericBinaryType = "application/octet-stream";

const checkFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (
    file.fieldname === "thumbnail" &&
    (allowedImageTypes.includes(file.mimetype) ||
      file.mimetype === genericBinaryType)
  ) {
    return callback(null, true);
  }

  if (file.fieldname === "pdf" && allowedPdfTypes.includes(file.mimetype)) {
    return callback(null, true);
  }

  return callback(
    new Error(
      `Unsupported file type for ${file.fieldname}: ${file.mimetype}`,
    ),
  );
};

const upload = multer({
  storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 2,
  },
});

export const validateFileType = async (buffer: Buffer): Promise<string> => {
  const detected = await fileTypeFromBuffer(buffer);

  if (!detected) {
    throw new Error("Could not determine file type");
  }

  if (
    !allowedImageTypes.includes(detected.mime) &&
    !allowedPdfTypes.includes(detected.mime)
  ) {
    throw new Error("Invalid file type");
  }

  return detected.mime;
};

export default upload;

export const uploadToCloudinary = async (buffer: Buffer, mimeType: string) => {
  const detectedMimeType = await validateFileType(buffer);

  if (detectedMimeType !== mimeType) {
    throw new Error("File type mismatch");
  }

  const resourceType = mimeType === "application/pdf" ? "raw" : "image";

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "frehaymanot",
        public_id: uuidv4(),
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });

  return result;
};

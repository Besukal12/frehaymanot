import { Router } from "express";
import {
  addCourse,
  addCategory,
  getCategory,
  getCourse,
  getCourseById,
  deleteCategory,
  deleteCourse,
  updateCategory,
  updateCourse,
} from "../../modules/course/course.controller.js";
import upload from "../../middleware/upload/uploadToCloudinary.js";

const router = Router();

router.post("/categories", addCategory);
router.get("/categories", getCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.post(
  "/create",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  addCourse,
);

router.get("/get", getCourse);
router.get("/get/:id", getCourseById);

router.patch(
  "/update/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateCourse,
);

router.delete("/delete/:id", deleteCourse);

export default router;

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
import { checkAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/categories", checkAuth, addCategory);
router.get("/categories", getCategory);
router.patch("/categories/:id", checkAuth, updateCategory);
router.delete("/categories/:id", checkAuth, deleteCategory);

router.post(
  "/create",
  checkAuth,
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
  checkAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateCourse,
);

router.delete("/delete/:id", checkAuth, deleteCourse);

export default router;

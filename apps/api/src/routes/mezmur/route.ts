import Router from "express";
import {
  addCategory,
  addMezmur,
  getCategory,
  getMezmur,
  getMezmurById,
  deleteCategory,
  deleteMezmur,
  updateCategory,
  updateMezmur,
} from "../../modules/mezmur/mezmur.controller.js";
import upload from "../../middleware/upload/uploadToCloudinary.js";
import { checkAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/categories-add", checkAuth, addCategory);
router.get("/categories-get", getCategory);
router.patch("/categories-update/:id", checkAuth, updateCategory);
router.delete("/categories-delete/:id", checkAuth, deleteCategory);

router.post(
  "/add",
  checkAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  addMezmur,
);

router.get("/get", getMezmur);
router.get("/get/:id", getMezmurById);

router.patch(
  "/update/:id",
  checkAuth,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateMezmur,
);

router.delete("/delete/:id", checkAuth, deleteMezmur);

export default router;

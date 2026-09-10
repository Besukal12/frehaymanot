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

const router = Router();

router.post("/categories-add", addCategory);
router.get("/categories-get", getCategory);
router.patch("/categories-update/:id", updateCategory);
router.delete("/categories-delete/:id", deleteCategory);

router.post(
  "/add",
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
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateMezmur,
);

router.delete("/delete/:id", deleteMezmur);

export default router;

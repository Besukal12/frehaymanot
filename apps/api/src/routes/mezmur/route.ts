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
  updateMezmur
} from "../../modules/mezmur/mezmur.controller.js";
import upload from "../../middleware/upload/uploadToCloudinary.js";

const router = Router();

// post routes for mezmur and mezmur category
router.post("/category", addCategory);
router.post(
  "/add",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  addMezmur,
);

//get routes for mezmur and mezmur category
router.get("/get-category", getCategory);
router.get("/get-mezmur", getMezmur);
router.get("/get-mezmur/:id", getMezmurById);

//delete routes for mezmur and mezmur category
router.delete("/delete-category", deleteCategory);
router.delete("/delete-mezmur", deleteMezmur);

//update routest for mezmur and mezmur category
router.post("/update-category", updateCategory)
router.post("/update-mezmur", updateMezmur)

export default router;

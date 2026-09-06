import Router from "express";
import {
  checkAuth,
  checkAdmin,
  checkUser,
} from "../../middleware/auth.middleware.js";
import {
  addCategory,
  addMezmur,
  getCategory,
  getMezmur,
  getMezmurById,
  deleteCategory,
  deleteMezmur
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
router.get("/mezmur-category", getCategory);
router.get("/get-mezmur", getMezmur);
router.get("/get-mezmur/:id", getMezmurById);

//delete routes for mezmur and mezmur category
router.delete("/delete-category", deleteCategory);
router.delete("/delete-mezmur", deleteMezmur);

export default router;

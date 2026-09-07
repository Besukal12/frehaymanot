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

router.post("/categories", addCategory);
router.get("/categories", getCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.post(
  "/mezmurs",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  addMezmur,
);

router.get("/mezmurs", getMezmur);
router.get("/mezmurs/:id", getMezmurById);

router.patch(
  "/mezmurs/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  updateMezmur,
);

router.delete("/mezmurs/:id", deleteMezmur);

export default router;

import Router from "express";
import {
  checkAuth,
  checkAdmin,
  checkUser,
} from "../../middleware/auth.middleware.js";
import {
  addCategory,
  addMezmur,
} from "../../modules/mezmur/mezmur.controller.js";
import upload from "../../middleware/upload/uploadToCloudinary.js";

const router = Router();

router.post("/category", addCategory);
router.post(
  "/add",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  addMezmur,
);

export default router;

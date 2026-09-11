import { Router } from "express";

import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../modules/announcement/announcement.controller.js";

import upload from "../../middleware/upload/uploadToCloudinary.js";
import { checkAuth } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  checkAuth,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  addAnnouncement,
);

router.get("/get", getAnnouncements);

router.get("/get/:id", getAnnouncementById);

router.patch(
  "/update/:id",
  checkAuth,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateAnnouncement,
);

router.delete("/delete/:id", checkAuth, deleteAnnouncement);

export default router;

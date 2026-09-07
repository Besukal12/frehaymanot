import { Router } from "express";

import {
  addAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../modules/announcement/announcement.controller.js";

import upload from "../../middleware/upload/uploadToCloudinary.js";

const router = Router();

router.post(
  "/",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  addAnnouncement,
);

router.get("/", getAnnouncements);

router.get("/:id", getAnnouncementById);

router.patch(
  "/:id",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateAnnouncement,
);

router.delete("/:id", deleteAnnouncement);

export default router;

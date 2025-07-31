// routes/settingsRoutes.js
import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { uploadWallpaperFile } from "../controllers/settingsController.js";
import { uploadWallpaper } from "../middleware/uploadWallpaper.js";
import { getWallpaperPresets } from "../controllers/settingsController.js";
import { getCurrentWallpaper } from "../controllers/settingsController.js";
import { getTrashedNotes, restoreNote, permanentlyDeleteNote } from "../controllers/notesController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { cleanUpTrashedNotes } from "../controllers/settingsController.js";


const router = express.Router();

router.get("/", getSettings);
router.put("/", updateSettings);

router.post("/upload-wallpaper", uploadWallpaper.single("wallpaper"), uploadWallpaperFile);
router.get("/wallpapers", getWallpaperPresets);
router.get("/current-wallpaper", getCurrentWallpaper);
router.get("/trash", verifyJWT, getTrashedNotes);
router.put("/trash/restore/:id", verifyJWT, restoreNote);
router.delete("/trash/delete/:id", verifyJWT, permanentlyDeleteNote);
router.delete("/trash/cleanup", verifyJWT, cleanUpTrashedNotes);


export default router;

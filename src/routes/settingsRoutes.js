// routes/settingsRoutes.js
import express from "express"
import {
  getSettings,
  updateSettings,
  uploadWallpaperFile,
  getWallpaperPresets,
  getCurrentWallpaper,
  cleanUpTrashedNotes,
  changePassword, // Import the new controller function
} from "../controllers/settingsController.js"
import { uploadWallpaper } from "../middleware/uploadWallpaper.js"
import { getTrashedNotes, restoreNote, permanentlyDeleteNote } from "../controllers/notesController.js"
import { verifyJWT } from "../middleware/verifyJWT.js"

const router = express.Router()

// General settings routes
router.get("/", getSettings)
router.put("/", updateSettings)

// Password change route - requires authentication
router.put("/change-password", verifyJWT, changePassword) // New route for changing password

// Wallpaper related routes
router.post("/upload-wallpaper", uploadWallpaper.single("wallpaper"), uploadWallpaperFile)
router.get("/wallpapers", getWallpaperPresets)
router.get("/current-wallpaper", getCurrentWallpaper)

// Trash related routes
router.get("/trash", verifyJWT, getTrashedNotes)
router.put("/trash/restore/:id", verifyJWT, restoreNote)
router.delete("/trash/delete/:id", verifyJWT, permanentlyDeleteNote)
router.delete("/trash/cleanup", verifyJWT, cleanUpTrashedNotes)

export default router

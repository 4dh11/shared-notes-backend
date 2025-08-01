import Settings from "../models/settingsModel.js";
import { autoDeleteOldTrashedNotes } from "./notesController.js";

// Get current settings
export async function getSettings(req, res) {
  try {
    const settings = await Settings.findOne(); // assuming single config
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
}


export async function updateSettings(req, res) {
  const { theme, wallpaper, isLocked, password, wallpaperPresets, dimLevel } = req.body;
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ theme, wallpaper, isLocked, password, wallpaperPresets, dimLevel });
    } else {
      if (theme) settings.theme = theme;
      if (wallpaper) settings.wallpaper = wallpaper;
      if (isLocked !== undefined) settings.isLocked = isLocked;
      if (password) settings.password = password;
      if (wallpaperPresets) settings.wallpaperPresets = wallpaperPresets;
      if (dimLevel !== undefined) settings.dimLevel = dimLevel;
    }

    await settings.save();
    res.status(200).json({ message: "Settings updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings" });
  }
}


export async function uploadWallpaperFile(req, res) {
  try {
    const wallpaperPath = `/uploads/wallpapers/${req.file.filename}`;
    
    // Optionally add it to preset wallpapers list in DB
    const settings = await Settings.findOne();
    if (!settings.wallpaperPresets) {
      settings.wallpaperPresets = [];
    }

    settings.wallpaperPresets.push(wallpaperPath);
    await settings.save();

    res.status(200).json({ message: "Wallpaper uploaded", path: wallpaperPath });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
}


// GET only wallpaperPresets list
export async function getWallpaperPresets(req, res) {
  try {
    const settings = await Settings.findOne();
    if (!settings || !settings.wallpaperPresets) {
      return res.status(404).json({ message: "No wallpapers found" });
    }

    res.status(200).json({ wallpaperPresets: settings.wallpaperPresets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallpapers", error });
  }
}


export async function getCurrentWallpaper(req, res) {
  try {
    const settings = await Settings.findOne();

    if (!settings || !settings.wallpaper) {
      return res.status(404).json({ message: "No active wallpaper set" });
    }

    res.status(200).json({
      wallpaper: settings.wallpaper,
      dimLevel: settings.dimLevel || 0
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching current wallpaper", error });
  }
}


// Trigger auto-delete of old trashed notes
export async function cleanUpTrashedNotes(req, res) {
  try {
    await autoDeleteOldTrashedNotes();
    res.status(200).json({ message: "Old trashed notes cleaned up" });
  } catch (error) {
    res.status(500).json({ message: "Error cleaning up trashed notes", error });
  }
}
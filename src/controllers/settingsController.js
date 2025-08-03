import Settings from "../models/settingsModel.js"
import { autoDeleteOldTrashedNotes } from "./notesController.js"
import bcrypt from "bcrypt" // Import bcrypt for password comparison

// Get current settings
export async function getSettings(req, res) {
  try {
    const settings = await Settings.findOne() // assuming single config
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" })
    }

    // IMPORTANT SECURITY NOTE:
    // The 'password' field in your database is HASHED.
    // You CANNOT return the plain text password from here.
    // Returning settings.password would expose the hash, which is not the plain text password
    // and is still a security risk.
    // Therefore, we explicitly OMIT the password field when sending settings to the frontend.
    const { password, ...settingsWithoutPassword } = settings.toObject() // Use .toObject() for Mongoose documents

    res.status(200).json(settingsWithoutPassword)
  } catch (error) {
    console.error("Error fetching settings:", error)
    res.status(500).json({ message: "Error fetching settings" })
  }
}

export async function updateSettings(req, res) {
  // Destructure fields, but EXCLUDE 'password' from this general update route
  const { theme, wallpaper, isLocked, wallpaperPresets, dimLevel } = req.body
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      // If settings don't exist, create them with defaults
      settings = new Settings({ theme, wallpaper, isLocked, wallpaperPresets, dimLevel })
    } else {
      if (theme) settings.theme = theme
      if (wallpaper) settings.wallpaper = wallpaper
      if (isLocked !== undefined) settings.isLocked = isLocked
      if (wallpaperPresets) settings.wallpaperPresets = wallpaperPresets
      if (dimLevel !== undefined) settings.dimLevel = dimLevel
    }

    await settings.save()
    res.status(200).json({ message: "Settings updated" })
  } catch (error) {
    console.error("Error updating settings:", error)
    res.status(500).json({ message: "Server error while updating settings" })
  }
}

// NEW: Controller function to change the app password securely
export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required." })
  }

  try {
    // Assuming a single global settings document for the app password
    // If passwords are user-specific, you'd fetch settings based on req.user.id
    const settings = await Settings.findOne({})

    if (!settings) {
      return res.status(404).json({ message: "App settings not found." })
    }

    // Compare current password with the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, settings.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password." })
    }

    // Update the password field. The pre-save hook in settingsModel will hash the newPassword.
    settings.password = newPassword
    await settings.save()

    res.status(200).json({ message: "Password changed successfully!" })
  } catch (error) {
    console.error("Error changing password:", error)
    res.status(500).json({ message: "Server error while changing password." })
  }
}

export async function uploadWallpaperFile(req, res) {
  try {
    const wallpaperPath = `/uploads/wallpapers/${req.file.filename}`

    // Optionally add it to preset wallpapers list in DB
    let settings = await Settings.findOne()
    if (!settings) {
      // Handle case where settings document might not exist yet
      settings = new Settings()
    }
    if (!settings.wallpaperPresets) {
      settings.wallpaperPresets = []
    }

    settings.wallpaperPresets.push(wallpaperPath)
    await settings.save()

    res.status(200).json({ message: "Wallpaper uploaded", path: wallpaperPath })
  } catch (error) {
    console.error("Error uploading wallpaper:", error)
    res.status(500).json({ message: "Upload failed", error })
  }
}

// GET only wallpaperPresets list
export async function getWallpaperPresets(req, res) {
  try {
    const settings = await Settings.findOne()
    if (!settings || !settings.wallpaperPresets) {
      return res.status(404).json({ message: "No wallpapers found" })
    }

    res.status(200).json({ wallpaperPresets: settings.wallpaperPresets })
  } catch (error) {
    console.error("Error fetching wallpapers:", error)
    res.status(500).json({ message: "Error fetching wallpapers", error })
  }
}

export async function getCurrentWallpaper(req, res) {
  try {
    const settings = await Settings.findOne()

    if (!settings || !settings.wallpaper) {
      return res.status(404).json({ message: "No active wallpaper set" })
    }

    res.status(200).json({
      wallpaper: settings.wallpaper,
      dimLevel: settings.dimLevel || 0,
    })
  } catch (error) {
    console.error("Error fetching current wallpaper:", error)
    res.status(500).json({ message: "Error fetching current wallpaper", error })
  }
}

// Trigger auto-delete of old trashed notes
export async function cleanUpTrashedNotes(req, res) {
  try {
    await autoDeleteOldTrashedNotes()
    res.status(200).json({ message: "Old trashed notes cleaned up" })
  } catch (error) {
    console.error("Error cleaning up trashed notes:", error)
    res.status(500).json({ message: "Error cleaning up trashed notes", error })
  }
}

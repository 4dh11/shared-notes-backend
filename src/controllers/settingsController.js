import Settings from "../models/settingsModel.js";
import { autoDeleteOldTrashedNotes } from "./notesController.js";

// Get current settings
export async function getSettings(req, res) {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        theme: 'dark',
        wallpaper: '',
        dimLevel: 0.3,
        wallpaperPresets: [
          '/uploads/wallpapers/eat%20cat.jpg',
          '/uploads/wallpapers/sleep%20cat.jpg',
          '/uploads/wallpapers/tuxedo%20and%20orange.jpg'
        ]
      });
      await settings.save();
    }
    
    // Return settings without the hashed password, but include a plaintext version for display
    const settingsObj = settings.toObject();
    
    // If you want to show the original password in settings (not recommended for production)
    // You would need to store it separately or use a different approach
    // For now, we'll indicate that password is set but encrypted
    if (settingsObj.password) {
      settingsObj.passwordSet = true;
      delete settingsObj.password; // Don't send hashed password to frontend
    }
    
    res.status(200).json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: "Error fetching settings" });
  }
}

export async function updateSettings(req, res) {
  const { theme, wallpaper, isLocked, password, wallpaperPresets, dimLevel } = req.body;
  
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        theme: theme || 'dark',
        wallpaper: wallpaper || '',
        isLocked: isLocked || false,
        password: password || '',
        wallpaperPresets: wallpaperPresets || [],
        dimLevel: dimLevel !== undefined ? dimLevel : 0.3
      });
    } else {
      // Update only provided fields
      if (theme !== undefined) settings.theme = theme;
      if (wallpaper !== undefined) settings.wallpaper = wallpaper;
      if (isLocked !== undefined) settings.isLocked = isLocked;
      if (password !== undefined) settings.password = password;
      if (wallpaperPresets !== undefined) settings.wallpaperPresets = wallpaperPresets;
      if (dimLevel !== undefined) settings.dimLevel = dimLevel;
    }

    await settings.save();
    
    console.log('Settings updated:', {
      theme: settings.theme,
      wallpaper: settings.wallpaper,
      dimLevel: settings.dimLevel,
      hasPassword: !!settings.password
    });
    
    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
}

export async function uploadWallpaperFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const wallpaperPath = `/uploads/wallpapers/${req.file.filename}`;
    
    // Optionally add it to preset wallpapers list in DB
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        wallpaperPresets: [wallpaperPath]
      });
    } else {
      if (!settings.wallpaperPresets) {
        settings.wallpaperPresets = [];
      }
      // Add to presets if not already there
      if (!settings.wallpaperPresets.includes(wallpaperPath)) {
        settings.wallpaperPresets.push(wallpaperPath);
      }
    }
    
    await settings.save();

    console.log('Wallpaper uploaded:', wallpaperPath);
    res.status(200).json({ 
      message: "Wallpaper uploaded successfully", 
      path: wallpaperPath,
      url: wallpaperPath // For consistency with frontend expectations
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
}

// GET only wallpaperPresets list
export async function getWallpaperPresets(req, res) {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Return default presets if no settings exist
      const defaultPresets = [
        '/uploads/wallpapers/eat%20cat.jpg',
        '/uploads/wallpapers/sleep%20cat.jpg',
        '/uploads/wallpapers/tuxedo%20and%20orange.jpg'
      ];
      
      return res.status(200).json({ wallpaperPresets: defaultPresets });
    }
    
    if (!settings.wallpaperPresets || settings.wallpaperPresets.length === 0) {
      return res.status(200).json({ wallpaperPresets: [] });
    }

    res.status(200).json({ wallpaperPresets: settings.wallpaperPresets });
  } catch (error) {
    console.error('Error fetching wallpapers:', error);
    res.status(500).json({ message: "Error fetching wallpapers", error: error.message });
  }
}

export async function getCurrentWallpaper(req, res) {
  try {
    const settings = await Settings.findOne();

    if (!settings || !settings.wallpaper) {
      return res.status(200).json({ 
        wallpaper: '',
        dimLevel: 0.3
      });
    }

    res.status(200).json({
      wallpaper: settings.wallpaper,
      dimLevel: settings.dimLevel !== undefined ? settings.dimLevel : 0.3
    });
  } catch (error) {
    console.error('Error fetching current wallpaper:', error);
    res.status(500).json({ message: "Error fetching current wallpaper", error: error.message });
  }
}

// Trigger auto-delete of old trashed notes
export async function cleanUpTrashedNotes(req, res) {
  try {
    await autoDeleteOldTrashedNotes();
    res.status(200).json({ message: "Old trashed notes cleaned up" });
  } catch (error) {
    console.error('Error cleaning up trashed notes:', error);
    res.status(500).json({ message: "Error cleaning up trashed notes", error: error.message });
  }
}
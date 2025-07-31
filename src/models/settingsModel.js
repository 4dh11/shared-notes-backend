import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SettingsSchema = new mongoose.Schema({
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  wallpaper: { type: String },
  wallpaperPresets: [{ type: String }],
  isLocked: { type: Boolean, default: false },
  password: { type: String },
  dimLevel: { type: Number, default: 0 },
});


// Hash password before saving
SettingsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Settings", SettingsSchema);

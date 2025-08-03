import mongoose from "mongoose"
import bcrypt from "bcrypt"

const SettingsSchema = new mongoose.Schema({
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  wallpaper: { type: String },
  wallpaperPresets: [{ type: String }],
  isLocked: { type: Boolean, default: false },
  password: { type: String }, // This field stores the HASHED password
  dimLevel: { type: Number, default: 0 },
})

// Hash password before saving
// This pre-save hook ensures that any time the 'password' field is modified and saved,
// it gets hashed. This is why you cannot retrieve the plain text password.
SettingsSchema.pre("save", async function (next) {
  // Only hash if the password field is being modified (e.g., on creation or update)
  // and ensure the password field actually has a value to hash.
  if (!this.isModified("password") || !this.password) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

export default mongoose.model("Settings", SettingsSchema)

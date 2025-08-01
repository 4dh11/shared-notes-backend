import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SettingsSchema = new mongoose.Schema({
  theme: { type: String, enum: ["light", "dark"], default: "dark" },
  wallpaper: { type: String, default: '' },
  wallpaperPresets: [{ type: String }],
  isLocked: { type: Boolean, default: false },
  password: { type: String },
  dimLevel: { type: Number, default: 0.3, min: 0, max: 1 },
}, {
  timestamps: true
});

// Hash password before saving
SettingsSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified and is not already hashed
  if (!this.isModified("password")) return next();
  
  // Don't hash empty passwords
  if (!this.password) return next();
  
  // Check if password is already hashed (bcrypt hashes start with $2b$)
  if (this.password.startsWith('$2b$')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
SettingsSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password is set
SettingsSchema.methods.hasPassword = function() {
  return !!this.password;
};

export default mongoose.model("Settings", SettingsSchema);
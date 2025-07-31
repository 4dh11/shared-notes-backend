import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Settings from "../models/settingsModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey"; // move to .env for production

export async function login(req, res) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const settings = await Settings.findOne();

    if (!settings || !settings.password) {
      return res.status(404).json({ message: "App password not set in database" });
    }

    const isMatch = await bcrypt.compare(password, settings.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign({ access: "shared_notes_user" }, JWT_SECRET, {
      expiresIn: "1h", // 1 hour validity
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
}

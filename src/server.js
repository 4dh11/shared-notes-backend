import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

console.log();

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB();

app.use(express.json());

app.use("/api/notes", notesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () =>{
    console.log("Server started on PORT:", PORT);
});
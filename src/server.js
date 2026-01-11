// backend/server.js
import express from "express"
import notesRoutes from "./routes/notesRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

// Configure CORS middleware
const allowedOrigins = [
  "http://localhost:5173", // Your frontend development URL (Vite default)
  "http://localhost:3000", // Common for Create React App development
  "https://shared-notes-frontend.onrender.com", // <--- PASTE YOUR ACTUAL FRONTEND URL HERE!
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin."
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
    credentials: true,
  }),
)

app.use(express.json())

app.use("/api/notes", notesRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/auth", authRoutes)

// IMPORTANT CHANGE HERE: Go up one directory from 'src' to find 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.listen(PORT, () => {
  console.log("Server started on PORT:", PORT)
})

// This tells your server to respond with "pong" when it hears "ping"
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

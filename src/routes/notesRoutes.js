import express from "express";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  getPinnedNotes,
  getNoteById
} from "../controllers/notesController.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();

// Order matters: specific routes before parameterized routes
router.get("/pinned", verifyJWT, getPinnedNotes);
router.get("/", verifyJWT, getAllNotes);
router.post("/", verifyJWT, createNote);
router.get("/:id", verifyJWT, getNoteById);
router.put("/:id", verifyJWT, updateNote);
router.delete("/:id", verifyJWT, deleteNote);

export default router;
import Note from "../models/Note.js"

// GET: All notes, with optional search (?q=...)
export async function getAllNotes(req, res) {
  try {
    const { q } = req.query
    let filter = { isTrashed: false } // Only non-trashed notes

    if (q) {
      filter = {
        isTrashed: false,
        $or: [{ title: { $regex: q, $options: "i" } }, { content: { $regex: q, $options: "i" } }],
      }
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 })
    res.status(200).json(notes)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error })
  }
}

// POST: Create a new note
export async function createNote(req, res) {
  try {
    const { title, content, pinned, alignment } = req.body // Destructure alignment

    const newNote = new Note({
      title,
      content,
      pinned: !!pinned, // convert to true/false
      alignment: alignment || "left", // Use provided alignment or default to 'left'
    })

    await newNote.save()
    res.status(201).json({ message: "Note created successfully", note: newNote })
  } catch (error) {
    console.error("Error creating note:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// PUT: Update a note
export async function updateNote(req, res) {
  const { id } = req.params
  const { title, content, pinned, alignment } = req.body // Destructure alignment

  if (!title && !content && typeof pinned !== "boolean" && !alignment) {
    // Check for alignment too
    return res.status(400).json({ message: "Nothing to update" })
  }

  try {
    const updatedFields = {}
    if (title !== undefined) updatedFields.title = title // Use !== undefined to allow empty string
    if (content !== undefined) updatedFields.content = content // Use !== undefined to allow empty string
    if (typeof pinned === "boolean") updatedFields.pinned = pinned
    if (alignment !== undefined) updatedFields.alignment = alignment // Add alignment to updated fields

    const updatedNote = await Note.findByIdAndUpdate(id, { $set: updatedFields }, { new: true })

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" })
    }

    res.status(200).json(updatedNote)
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error })
  }
}

// DELETE: Move a note to trash
export async function deleteNote(req, res) {
  const { id } = req.params
  try {
    const trashedNote = await Note.findByIdAndUpdate(
      id,
      { $set: { isTrashed: true, trashedAt: new Date() } },
      { new: true },
    )
    if (!trashedNote) {
      return res.status(404).json({ message: "Note not found" })
    }
    res.status(200).json({ message: "Note moved to trash" })
  } catch (error) {
    res.status(500).json({ message: "Error moving note to trash", error })
  }
}

// GET: All trashed notes
export async function getTrashedNotes(req, res) {
  try {
    const trashedNotes = await Note.find({ isTrashed: true }).sort({ trashedAt: -1 })
    res.status(200).json(trashedNotes)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trashed notes", error })
  }
}

// PUT: Restore a trashed note
export async function restoreNote(req, res) {
  const { id } = req.params
  try {
    const restoredNote = await Note.findByIdAndUpdate(
      id,
      { $set: { isTrashed: false, trashedAt: null } },
      { new: true },
    )
    if (!restoredNote) {
      return res.status(404).json({ message: "Note not found" })
    }
    res.status(200).json({ message: "Note restored", note: restoredNote })
  } catch (error) {
    res.status(500).json({ message: "Error restoring note", error })
  }
}

// DELETE: Permanently delete a trashed note
export async function permanentlyDeleteNote(req, res) {
  const { id } = req.params
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: id, isTrashed: true })
    if (!deletedNote) {
      return res.status(404).json({ message: "Trashed note not found" })
    }
    res.status(200).json({ message: "Note permanently deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error permanently deleting note", error })
  }
}

// DELETE: Permanently delete all trashed notes older than 30 days
export async function autoDeleteOldTrashedNotes() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  try {
    await Note.deleteMany({ isTrashed: true, trashedAt: { $lt: cutoff } })
  } catch (error) {
    console.error("Error auto-deleting old trashed notes:", error)
  }
}

// GET: Pinned notes only
export async function getPinnedNotes(req, res) {
  try {
    const pinnedNotes = await Note.find({ pinned: true, isTrashed: false }).sort({ updatedAt: -1 })
    res.status(200).json(pinnedNotes)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pinned notes", error })
  }
}

// GET: Get a single note by ID
export async function getNoteById(req, res) {
  const { id } = req.params
  try {
    const note = await Note.findById(id)
    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }
    res.status(200).json(note)
  } catch (error) {
    res.status(500).json({ message: "Error fetching note", error })
  }
}

import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    // Removed alignment field
  },
  { timestamps: true },
)

const Note = mongoose.model("Note", noteSchema)

export default Note

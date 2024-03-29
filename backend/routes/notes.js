const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchAllNotes". (Login required)
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ROUTE 2: Post a new Note using: POST "/api/notes/newNote". (Login required)
router.post(
  "/newNote",
  fetchUser,
  [
    body("title").isLength({ min: 3 }).withMessage("Enter a valid title"),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);

      // If there are errors, return Bad request and the errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();

      res.json(saveNote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updateNote". (Login required)
router.put("/updateNote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // Create a new note object
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Note found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deleteNote". (Login required)
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Note found");
    }

    // Allow deletion only if user own this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

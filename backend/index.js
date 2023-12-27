const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const auth = require("./routes/auth");
const notes = require("./routes/notes");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const connectToMongo = db;
connectToMongo();

// Available Routes
app.use("/api/auth", auth);
app.use("/api/notes", notes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`NoteHub backend listening at http://localhost:${port}`);
});

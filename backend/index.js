const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

connectToMongo();
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

/* `app.use(express.json())` is a middleware function in Express that parses incoming requests with JSON payloads. It basically allows the server to accept JSON data in the request body and parse it into a JavaScript object that can be easily used in the server-side code. */
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`NoteHub backend listening at http://localhost:${port}`);
});

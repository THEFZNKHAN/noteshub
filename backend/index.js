const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 3000;

/* `app.use(express.json())` is a middleware function in Express that parses incoming requests with JSON payloads. It basically allows the server to accept JSON data in the request body and parse it into a JavaScript object that can be easily used in the server-side code. */
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

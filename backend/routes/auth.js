const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Faizisagood$guy";

// ROUTE 1: Create a User using: POST "/api/auth/createuser".  Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long."),
    body("email", "Please include a valid email").isEmail(),
    body("password", "password length should be atleast 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    try {
      const user = await newUser.save();
      const data = {
        user: {
          id: user.id,
        },
      };
      // Return jsonwebtoken
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
      });
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login require
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = router;

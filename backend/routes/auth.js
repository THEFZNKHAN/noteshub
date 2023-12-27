const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: Create a User using: POST "/api/auth/createUser".  (Doesn't require Auth)
router.post(
  "/createUser",
  [
    body("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long."),
    body("email", "Please include a valid email").isEmail(),
    body("password", "password length should be at least 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
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
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". (No login require)
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Incorrect Password...",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
);

// ROUTE 3: Get loggedIn User Details using: POST "/api/auth/getUser". (Login required)
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
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

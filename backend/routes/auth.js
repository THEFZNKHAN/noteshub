const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Faizisagood$guy";

// Create a User using: POST "/api/auth/".  Doesn't require Auth
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
        error: "Please enter a unique value for email",
        message: err.message,
      });
    }
  }
);

module.exports = router;

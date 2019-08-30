const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/Users");
const Content = require("../models/Shop");

//Purpose: to allow admin to perform CRUD Ops on to the website via
//         secured route

// @router  GET api/shop
// @desc    Get all content
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    //stuff represents all the items that are stored in the database
    const stuff = await Content.find({}).sort({ date: -1 });
    res.json(stuff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @router  POST api/shop
// @desc    Add new content
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("colour", "Colour is required")
        .not()
        .isEmpty(),
      check("size", "Size is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // requesting the data that is sent to the route & validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //input taken
    const { name, colour, size } = req.body;
    try {
      const newContent = new Content({
        name,
        colour,
        size,
        user: req.user.id
      });

      //new db entry created and saved
      const content = await newContent.save();

      res.json(content);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @router  PUT api/shop/:id
// @desc    Get all content
// @access  Private

router.put("/:id", (req, res) => {
  res.send("update episode");
});

// @router  PUT api/shop/:id
// @desc    Get all content
// @access  Private

router.delete("/:id", (req, res) => {
  res.send("Delete episode");
});

module.exports = router;
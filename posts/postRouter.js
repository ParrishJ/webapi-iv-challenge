const express = require("express");

const Post = require("./postDb.js");
const router = express.Router();

router.get("/", (req, res) => {
  Post.get()
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(error => {
      res.status(500).json({ error: "Posts could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Post.getById(id)
    .then(post => {
      res.status(200).json({ post });
    })
    .catch(error => {
      res.status(500).json({ error: "Post could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

/* function validatePostId(req, res, next) {} */

module.exports = router;

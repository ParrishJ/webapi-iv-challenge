const express = require("express");

const User = require("./userDb.js");
const Post = require("../posts/postDb.js");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  const { name } = req.body;
  User.insert({
    name
  })
    .then(response => {
      res.status(201).json({ name });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while adding the user to the database"
      });
    });
});

router.post("/:id/posts", validatePost, validateUserId, (req, res) => {
  const { id } = req.params;
  const { text, user_id } = req.body;
  const postData = { ...req.body, user_id: req.params.id };
  console.log("user id ----->", user_id);
  Post.insert(postData)
    .then(response => {
      res.status(201).json({ text, user_id });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

router.get("/", (req, res) => {
  User.get()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(error => {
      res.status(500).json({ error: "Users could not be retrieved." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  User.getById(id)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(error => {
      res.status(500).json({ error: "User could not be retrieved." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  User.getUserPosts(id)
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(error => {
      res.status(500).json({ error: "User comments could not be retrieved." });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  User.remove(id)
    .then(response => {
      res.json({ message: "User successfully removed" });
    })
    .catch(error => {
      res.status(500).json({ message: "Error removing user" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  User.update(id, { name })
    .then(response => {
      res.status(200).json({ name });
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be updated" });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  User.getById(req.params.id)
    .then(user => {
      if (user.length !== 0) {
        req.user = user;
        next();
      }
    })
    .catch(error => {
      res.status(400).json({ message: "invalid user id" });
    });
}

function validateUser(req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;

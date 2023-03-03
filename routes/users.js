const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// get all users
router.get("/", async (req, res) => {
  console.log(req.isAuth);
  if (req.isAuth) {
    const data = await User.findById(req.userId);
    res.send(data);
  } else {
    res.send("Please Login");
  }
});

// upadate user

router.put("/:id", async (req, res) => {
  if (req.isAuth) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findOneAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("Please login");
  }
});
// delete user
router.delete("/:id", async (req, res) => {
  if (req.isAuth) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Your account has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("please login");
  }
});
// get a user
router.get("/:id", async (req, res) => {
  if (req.isAuth) {
    try {
      const user = await User.findById(req.params.id);
      const { password, updatedAt, ...others } = user_doc;
      res.status(200).json(others);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.send("please login");
  }
});
// follow user
router.put("/:id/follow", async (req, res) => {
  if (req.isAuth) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You are already following this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});
// unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.isAuth) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You already unfollowing");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;

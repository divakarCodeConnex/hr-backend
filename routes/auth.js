const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user1 = await User.find({ email: req.body.email });
    if (user1.length > 0) {
      res.send("Email already Registered");
      return;
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    // const user = await User.findOne({ email: req.body.email });
    // !user && res.status(404).json("wrong email");
    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    // !validPassword && res.status(400).json("wrong paasword");
    // res.status(200).json(user);
    const user = await User.find({ email: req.body.email });
    if (user.length == 0) {
      res.send("wrong email");
      return;
    }
    const password = user[0].password;
    const checkPass = await bcrypt.compare(req.body.password, password);
    console.log(checkPass);
    if (checkPass) {
      const token = jwt.sign(
        {
          userid: user[0]._id,
          email: user[0].email,
          admin: user[0].admin,
        },
        "qwerty!@#$",
        { expiresIn: "5days" }
      );
      res.send({ token });
      return;
    } else {
      res.send("Wrong Password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;

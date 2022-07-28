const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");

const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isAdmin = require("../middlewares/isAdmin");
const JobsModel = require("../models/Jobs.model");

const saltRounds = 10;

router.post("/signup", async (req, res) => {
  try {
    // Primeira coisa: Criptografar a senha!

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: passwordHash,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "This profile is not exist" });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "User is not actived." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      const token = generateToken(user);
      const pilotJobs = await JobsModel.find({ pilot: user._id });
      user.jobs = pilotJobs;
      const createdJobs = await JobsModel.find({ owner: user._id });
      user.createdJobs = createdJobs;
      return res.status(200).json({
        token: token,
        user: { ...user._doc },
      });
    } else {
      return res.status(400).json({ message: "Wrong password or email." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  const loggedInUser = req.currentUser;
  console.log("esse é o logged", loggedInUser);
  if (loggedInUser.isActive === false) {
    return res.status(401).json({ message: "User is not actived." });
  }

  const user = await UserModel.findById(loggedInUser._id);
  console.log("esse é o user", user);
  // .populate(
  //   "testimonials"
  // );
  // .populate("reviews");

  const pilotJobs = await JobsModel.find({ pilot: user._id });
  user.jobs = pilotJobs;
  const createdJobs = await JobsModel.find({ owner: user._id });
  user.createdJobs = createdJobs;
  return res.status(200).json(user);
});

router.patch("/update-profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    console.log("esse é o req.body", req.body);
    const loggedInUser = req.currentUser;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { ...req.body },
      { runValidators: true, new: true }
    );

    delete updatedUser._doc.passwordHash;

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//SOFT DELETE

router.delete(
  "/disable-profile",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const disabledUser = await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        {
          isActive: false,
          disabledOn: Date.now(),
          email: "disable" + Math.random() + "@teste.com",
          name: "disable" + Math.random(),
          nickname: "disable" + Math.random(),
        },
        { runValidators: true, new: true }
      );

      delete disabledUser._doc.passwordHash;

      return res.status(200).json(disabledUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    return res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;

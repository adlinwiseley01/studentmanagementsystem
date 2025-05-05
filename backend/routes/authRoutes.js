// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     console.log("Incoming Request Body:", req.body);

//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     console.log("Login Request Body:", req.body);

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Login successful!",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// router.post("/forgot-password", async (req, res) => {
//   try {
//     console.log("Forgot Password Request Body:", req.body);

//     const { email, password, confirmPassword } = req.body;

//     if (!email || !password || !confirmPassword) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "User with this email does not exist" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: "Password has been successfully updated!" });
//   } catch (err) {
//     console.error("Forgot Password Error:", err);
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔹 Register Route
router.post("/register", async (req, res) => {
  try {
    console.log("📥 Incoming Request Body:", req.body);

    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userType,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("📥 Login Request Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});
// 🔹 Get All Users Based on User Type
router.get("/users/:userType", async (req, res) => {
  try {
    const { userType } = req.params;
    console.log("Fetching users of type:", userType); // Log the request

    if (!["student", "staff", "admin"].includes(userType)) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    const users = await User.find({ userType });
    console.log("Fetched users:", users); // Log fetched users

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Fetch Users Error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});
router.post("/forgot-password", async (req, res) => {
  try {
    console.log("Forgot Password Request Body:", req.body);

    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User with this email does not exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been successfully updated!" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

module.exports = router;

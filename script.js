const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET_KEY = "mySecretKey";

// Route to generate a token with 1-hour expiry
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  // Create a token with expiry of 1 hour
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({
    message: "Token generated successfully",
    token,
  });
});

// Route to verify the token
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      message: "Token is valid",
      data: decoded,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

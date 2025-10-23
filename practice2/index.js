const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key (keep this safe)
const SECRET_KEY = "mysecretkey";

// Dummy user data
const user = {
id: 1,
username: "testuser",
password: "password123"
};

// ---------------- LOGIN ROUTE ----------------
app.post("/login", (req, res) => {
const { username, password } = req.body;

if (username === user.username && password === user.password) {
    // Create JWT token
    const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
    );
    res.json({ token });
} else {
    res.status(401).json({ message: "Invalid credentials" });
}
});

// ---------------- VERIFY TOKEN MIDDLEWARE ----------------
function verifyToken(req, res, next) {
const authHeader = req.headers["authorization"];
if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
}

const token = authHeader.split(" ")[1];
jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
    return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
});
}

// ---------------- PROTECTED ROUTE ----------------
app.get("/protected", verifyToken, (req, res) => {
res.json({
    message: "You have accessed a protected route!",
    user: req.user
});
});

// ---------------- START SERVER ----------------
app.listen(3000, () => {
console.log("✅ Server running on http://localhost:3000");
});

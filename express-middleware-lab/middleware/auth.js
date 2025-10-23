const jwt = require('jsonwebtoken');
const SECRET = "mysecretkey"; // keep in env variable in real apps

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Authentication header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

module.exports = { auth, SECRET };

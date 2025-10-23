const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'mysecretkey';

// Fake users
const users = [
{ username: 'adminuser', password: 'admin123', role: 'Admin' },
{ username: 'moderator', password: 'mod123', role: 'Moderator' },
{ username: 'user', password: 'user123', role: 'User' }
];

// ✅ Login route
app.post('/login', (req, res) => {
const { username, password, role } = req.body;

const user = users.find(u => u.username === username && u.password === password && u.role === role);
if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
}

const token = jwt.sign({ username, role }, SECRET_KEY, { expiresIn: '1h' });
res.json({ token });
});

// ✅ Middleware to verify JWT token
function verifyToken(req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(403).json({ message: 'Token required' });

const token = authHeader.split(' ')[1];
jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
});
}

// ✅ Role-based access control
function authorizeRoles(...roles) {
return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
};
}

// ✅ Protected routes
app.get('/admin-dashboard', verifyToken, authorizeRoles('Admin'), (req, res) => {
res.json({
    message: 'Welcome to the Admin dashboard.',
    user: req.user.username,
    role: req.user.role,
    date: new Date().toISOString()
});
});

app.get('/moderator-panel', verifyToken, authorizeRoles('Moderator', 'Admin'), (req, res) => {
res.json({
    message: 'Welcome to the Moderator panel.',
    user: req.user.username,
    role: req.user.role,
    date: new Date().toISOString()
});
});

app.get('/user-profile', verifyToken, (req, res) => {
res.json({
    message: `Welcome to your profile, ${req.user.username}.`,
    user: req.user.username,
    role: req.user.role,
    date: new Date().toISOString()
});
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

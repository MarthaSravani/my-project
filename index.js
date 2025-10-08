const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-secure'; // Use a strong, secret key in a real app

// Middleware to parse JSON request bodies
app.use(express.json());

// --- In-memory Data (for demonstration) ---
// In a real application, this would come from a database.
const users = [
    {
        id: 1,
        username: 'user1',
        password: 'password123'
    }
];

let accountBalance = 1000; // Starting balance

// --- Middleware for Token Verification ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach decoded user payload to the request
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    return next();
};


// --- API Routes ---

// 1. Login Route to get a token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user in our "database"
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // User found, create a token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        res.status(200).json({ token });
    } else {
        // User not found or password incorrect
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// 2. Protected Route: Get Balance
app.get('/balance', verifyToken, (req, res) => {
    res.status(200).json({ balance: accountBalance });
});

// 3. Protected Route: Deposit Money
app.post('/deposit', verifyToken, (req, res) => {
    const { amount } = req.body;
    
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid deposit amount' });
    }
    
    accountBalance += amount;
    res.status(200).json({ message: `Deposited $${amount}`, newBalance: accountBalance });
});

// 4. Protected Route: Withdraw Money
app.post('/withdraw', verifyToken, (req, res) => {
    const { amount } = req.body;
    
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }

    if (amount > accountBalance) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    accountBalance -= amount;
    res.status(200).json({ message: `Withdrew $${amount}`, newBalance: accountBalance });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Banking API server is running on http://localhost:${PORT}`);
});
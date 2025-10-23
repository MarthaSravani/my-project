const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');

const app = express();
connectDB();

app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/account', require('./routes/account'));
app.use('/api', require('./routes/public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initSocket = require('./socket');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Init Socket.io
const io = initSocket(server);
app.set('io', io);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/saved', require('./routes/saved'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// Root route
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'EstateX API is live! Visit /api/health for status.' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'EstateX API is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen when not running on Vercel (serverless)
if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`🚀 EstateX server running on port ${PORT}`);
    });
}

module.exports = app;

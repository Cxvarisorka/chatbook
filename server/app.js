const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dns = require('dns/promises');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Secuirty middlewares
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
// const xss = require('xss');
const rateLimit = require('express-rate-limit');

// Routers
const postRouter = require('./router/post.router');
const globalErrorHandler = require('./controllers/error.controllers');
const authRouter = require('./router/auth.router');

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after an hour'
}));
// app.use(helmet());
// app.use(mongoSanitizer());
// app.use(xss());



// origin: process.env.CLIENT,
// app.use(express.static(path.join(__dirname, "dist")));
app.use('/images', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'images')));


app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}

// Using routers
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);

// next with value you mean calling error handler
// Error handler middleware
app.use(globalErrorHandler);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to mongoDB');
        
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
        
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });


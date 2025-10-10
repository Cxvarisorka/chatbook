const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routers
const postRouter = require('./router/post.router');
const globalErrorHandler = require('./controllers/error.controllers');
const authRouter = require('./router/auth.router');

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// origin: process.env.CLIENT,


app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Using routers
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter)

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


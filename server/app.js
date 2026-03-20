const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dns = require('dns/promises');

// For socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Secuirty middlewares
// const helmet = require('helmet');
// const mongoSanitizer = require('express-mongo-sanitize');
// // const xss = require('xss');
// const rateLimit = require('express-rate-limit');

// Routers
const postRouter = require('./router/post.router');
const globalErrorHandler = require('./controllers/error.controllers');
const authRouter = require('./router/auth.router');
const userRouter = require('./router/user.router');
const commentRouter = require('./router/comment.router');
const friendRequestRouter = require('./router/friendRequest.router');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors({
    origin: "*",
    credentials: true
}));

io.use((socket, next) => {
    const user = socket.handshake.auth;
    if (!user) {
        return next(new Error("invalid user"));
    }
    socket.user = user;
    next();
});

// OnlineUsers which stores all connected users (online)
const onlineUsers = new Map();

io.on('connection', (socket) => {
    // Storing the current user which connected to socket in map
    onlineUsers.set(socket.user._id, socket.id);

    console.log('New user connected', socket.id);

    // Listener for message
    socket.on('private-message', ({ to, message }) => {
        const recipientSocketId = onlineUsers.get(to);

        // Checking if user is online
        if (recipientSocketId) {
            // If he is online emit event for that user
            io.to(recipientSocketId).emit('private-message', {
                from: socket.user._id,
                message,
                createdAt: new Date()
            });
        }
        // TODO: also save to DB (step 2)
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.user._id);
    });
})


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
app.use('/api/users', userRouter);
app.use('/api/friend-request', friendRequestRouter);
app.use('/api/comments', commentRouter);


// next with value you mean calling error handler
// Error handler middleware
app.use(globalErrorHandler);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to mongoDB');
        
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
        
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });


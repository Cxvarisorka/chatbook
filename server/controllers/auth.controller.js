// Models
const User = require("../models/user.model");

// Modules
const jwt = require("jsonwebtoken");

// Utils
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (user) => {
    return jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user);
    
    res.cookie("lt", token, {
        maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        httpOnly: true,
        sameSite: "Lax"
    });

    // 4) ვაბრუნებთ მოხმარებლის მონაცემებს და JWT Token
    res.status(statusCode).json({
        status: "success",
        data: {
            user
        }
    });
};

// Signup
const signup = catchAsync(async (req, res, next) => {
    const { email, password, fullname } = req.body;

    const newUser = await User.create({
        email,
        password,
        fullname
    });

    const code = newUser.createVerificationCode();
    await newUser.save({ validateBeforeSave: false });
    
    const url = `${req.protocol}://${req.get("host")}/api/auth/verify/${code}`;

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Email Verification</title>
        <style>
            body {
            background-color: #f4f6f8;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            }
            .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 40px 30px;
            text-align: center;
            }
            h1 {
            color: #4a90e2;
            margin-bottom: 20px;
            }
            p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            }
            .btn {
            display: inline-block;
            background: #4a90e2;
            color: #fff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: background 0.3s ease;
            }
            .btn:hover {
            background: #3c7dc0;
            }
            .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #888;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Welcome to Chatbook 🎉</h1>
            <p>Hi there, thank you for signing up!<br>
            Please verify your email address to get started with Chatbook.</p>
            <a href="${url}" class="btn">Verify Email</a>
            <p class="footer">If you didn’t create this account, you can safely ignore this email.</p>
        </div>
        </body>
        </html>
    `;

    sendEmail(email, "Welcome to Chatbook", html);

    res.status(201).json({
        status: "success",
        message: "User created! please verify your email!"
    });
});

const login = catchAsync(async (req, res, next) => {
    // 1) მომხმარებლის მონაცემების წაკითხვა
    const { email, password } = req.body;

    // 2) ვამოწმებთ არსებობს თუ არა მომხმარებელი შემოტანილი იმეილით
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new AppError("User email or password is incorrect!", 404))
    }

    if(!user.isVerified) {
        return next(new AppError("user is not verified! please verify your email", 401));
    }

    // 3) ვამოწმბეთ ჰეშირებულ პაროლსა და შემოტანილ პაროლს უდრის თუ არა ერმანეთს
    const isCorrect = await user.comparePassword(password, user.password);

    if(!isCorrect) {
        return next(new AppError("User email or password is incorrect!", 404))
    }

    // სანამ დავაბრუნებთ მომხმარებლის დოკუმენტს იქამდე წავშალოთ პაროლი
    user.password = undefined;

    // 1) payload - ის მონაცემები რომლის ენკრიპტაციაც გვინდა Luka - xZyEzefewf

    createSendToken(user, 200, res);
});

const autoLogin = (req, res) => {
    const user = req.user;

    return res.status(200).json(user);
};

const logout = (req, res) => {
    res.clearCookie('lt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "dev" ? false : true,        // true if using HTTPS
        sameSite: 'Lax',   
    });

    return res.status(200).json({ message: 'Logged out successfully' });
};

const verifyEmail = catchAsync(async (req, res, next) => {
    const { code } = req.params;

    const user = await User.findOne({ verificationCode: code });

    if(!user) {
        return next(new AppError("Verification code is invalid!", 400));
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).send("<h1>User is verified</h1>");
});



module.exports = { signup, login, verifyEmail, autoLogin, logout };
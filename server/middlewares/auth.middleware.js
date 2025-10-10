const User = require("../models/user.model");
const AppError = require("../utils/appError.js");
const jwt = require("jsonwebtoken");


const allowedTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("You don't have a permission to these resourses or methods!", 401))
        }

        next();
    }
}


const protect = async (req, res, next) => {
    try {
        const token = req.cookies.lt;

        if(!token) {
            return next(new AppError("user is not logged in!", 401));
        }

        // 2) გავაკეთოთ დეკრიპტაცია (დავაბრუნოთ ტოკენი ძველ ფორმაში) საიდუმლო გასაღებით
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return next(new AppError("token is invalid!", 400));
        }

        // 3) ობიექტში მოთავსებული id მოვიძიოთ მომხმარებელი და მომხმარებლის ობიექტი მივამაგროთ req ობიექტს
        const user = await User.findById(decoded.id);

        if(!user) {
            return next(new AppError("user can't be found!", 404));
        }



        // 4) მივამაგროთ user ობუიექტი req ობიექტს
        req.user = user;

        next();
    } catch(err) {

        if(err.name === "TokenExpiredError") {
            return next(new AppError("token expired!"));
        }

        return next(new AppError("you are not authroized!", 401));
    }
}

module.exports = {protect, allowedTo};
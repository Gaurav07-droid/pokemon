const User = require("../models/userModel");
const { promisify } = require("util");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { use } = require("../app");

const signToken = (user, res) => {
  //Token valid till 1 hour
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  console.log(process.env.JWT_COOKIE_EXP);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") cookieOption.secure = true;

  res.cookie("jwt", token, cookieOption);
  res.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const user = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //signing token
  signToken(user, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password!", 401));

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(new AppError("No user found with that email!Try again", 401));

  const validPass = await user.comparePassword(user.password, password);
  if (!validPass)
    return next(new AppError("Incorrect password!Try again", 401));

  //signing token
  signToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie.jwt) {
    token = req.cookie.jwt;
  }

  if (!token)
    return next(new AppError("Please log in to access this route!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("User belonging to this token no longer exists!", 401)
    );
  }

  req.user = currentUser;

  next();
});

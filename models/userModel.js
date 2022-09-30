const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, "Email already used!Use different email"],
    validate: [validator.isEmail, "Please provide a valid email"],
    required: [true, "Please provide user email"],
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Password must be 8 characters long!"],
  },

  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (pass) {
        return this.password === pass;
      },
    },
    message: "Password doesn\nt match ! Please try again",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (pass, userPass) {
  return await bcrypt.compare(userPass, pass);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

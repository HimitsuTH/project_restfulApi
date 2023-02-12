const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/index");


exports.index = async (req, res, next) => {
  let user = await User.find().sort({ _id: -1 });
  res.status(200).json({
    data: user,
  });

  // res.json({ fullname: "Chinnawich Ampai" }).status(200);
};


exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information!");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let user = new User();
    const existEmail = await User.findOne({ email: email });

    if (existEmail) {
      const error = new Error("Email has alrealy exist!");
      error.statusCode = 400;
      throw error;
    }
    if (password.length < 5) {
      const error = new Error("Password not match!");
      error.statusCode = 400;
      throw error;
    }

    user.name = name;
    user.email = email;
    user.role = role;
    user.password = await user.encryptPassword(password);

    await user.save();

    res.status(200).json({
      message: `Hello , ${name} : ${email}`,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information!");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("user has alrealy exist!");
      error.statusCode = 404;
      throw error;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("password not match!");
      error.statusCode = 401;
      throw error;
    }

    //creat token

    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.SECRET_KEY,
      {
        expiresIn: "5 days",
      }
    );

    const expires_in = jwt.decode(token);

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (err) {
    next(err);
  }
};

exports.profile = (req, res, next) => {
  const { name, email, role } = req.user;
  res.status(200).json({
    user: {
      name,
      email,
      role,
    },
  });
};

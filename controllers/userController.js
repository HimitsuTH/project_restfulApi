const User = require("@models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("@config/index");

exports.index = async (req, res, next) => {
  let user = await User.find().sort({ _id: -1 });
  res.status(200).json({
    data: user,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const existEmail = await User.findOne({ email: email });

    if (existEmail) {
      const error = new Error("Email has alrealy exist ❗");
      error.statusCode = 400;
      throw error;
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.role = role;
    user.password = await user.encryptPassword(password);

    await user.save();

    res.status(201).json({
      message: `Hello , name : ${name} | email : ${email}`,
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
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User has alrealy exist ❗");
      error.statusCode = 404;
      throw error;
    }

    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("password not match ❗");
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

exports.update = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    if(password) {
      if (password?.length <= 5) {
        const error = new Error("Password more than 5 characters.");
        error.statusCode = 400;
        throw error;
      }
    }

    // const check = "ss";
    // if(check) {
    //   console.log("true")
    // }else {
    //   console.log("false");
    // }

    const user = await User.findById(id);

    const updateUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...(name && { name }),
        ...(password && { password: await user?.encryptPassword(password) }),
      }
    );

    if (!updateUser) {
      const error = new Error("User not founded. ❗");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      message: "Updated Successfully ✔",
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Error on param
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const user = await User.deleteOne({ _id: id });
    // console.log(beforeDelete);

    if (user.deletedCount === 0) {
      const error = new Error("User ID not founded. ❗");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: `Deleted Successfully ✔`,
    });
  } catch (err) {
    next(err);
  }
};

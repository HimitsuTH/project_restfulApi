const Shop = require("../model/shop");
const Headphone = require("../model/headphone");
// const config = require("../config/index");
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const shops = await Shop.find()
    .select("name photo location")
    .sort({ _id: -1 });

  res.status(200).json({
    data: shops,
  });
};

exports.product = async (req, res, next) => {
  const headphones = await Headphone.find().populate("shop");

  res.status(200).json({
    data: headphones,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id).populate("headphones");

    if (!shop) {
      const error = new Error("Shop not founded 🛑");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      data: shop,
    });
  } catch (err) {
    next(err);
  }
};

exports.insert = async (req, res, next) => {
  try {
    const { name, description, photo } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information!");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let shop = new Shop({
      name: name,
      description: description,
    });

    await shop.save();

    res.status(200).json({
      message: `Insert Shop: ${shop.name} Successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop_data = await Shop.findById(id);
    const shop = await Shop.deleteOne({
      _id: id,
    });

    //check log
    // console.log(headphones);

    if (shop.deletedCount === 0) {
      const error = new Error("There are no Shop ID in the information.");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: `Successfully removed : ${shop_data.name} ✔`,
    });
  } catch (error) {
    next(error);
  }
};

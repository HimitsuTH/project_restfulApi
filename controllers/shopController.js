const Shop = require("../models/shop");
const Headphone = require("../models/headphone");
const Brand = require("../models/brand");

const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const shops = await Shop.find().sort({ _id: -1 });

  res.status(200).json({
    data: shops,
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
    const { name, description } = req.body;
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

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information!");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const shop = await Shop.findById(id);
    const brandInShop = await Brand.find({ shop: id });

    let setBrand = [];

    brandInShop?.map((brand) => {
      setBrand = [
        ...setBrand,
        { id: brand.id, name: brand.name, description: brand.description },
      ];
    });

    const setShop = {
      id: shop._id,
      name: shop.name,
      Brand: setBrand,
    };

    res.status(200).json({
      data: setShop,
    });
  } catch (err) {}
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

const Shop = require("../models/shop");
const Brand = require("../models/brand");
const Headphone = require("../models/headphone");

const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const shops = await Shop.find().sort({ _id: -1 }).select("name description");

  res.status(200).json({
    data: shops,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id).populate("headphones");

    if (!shop) {
      const error = new Error("Shop not founded ❗");
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
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let shop = new Shop({
      name: name,
      description: description,
    });

    await shop.save();

    res.status(201).json({
      message: `Insert Shop: ${shop.name} ✔ Successfully`,
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
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const shop = await Shop.findById(id)
      .populate("brands")
      .select("name description");

    res.status(200).json({
      data: shop,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const beforeUpdate = await Shop.findById(id);

    const shop = await Shop.findByIdAndUpdate(id, {
      name: name || beforeUpdate.name,
      description: description || beforeUpdate.description,
    });

    if (!shop) {
      const error = new Error("shop not founded ❗");
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
  try {
    const { id } = req.params;
    const shop_data = await Shop.findById(id);
    const shop = await Shop.deleteOne({
      _id: id,
    });

    //check log
    // console.log(headphones);

    if (shop.deletedCount === 0) {
      const error = new Error("Don't have Shop ID in the information.❗");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: `Removed Successfully : ${shop_data.name} ✔`,
    });
  } catch (error) {
    next(error);
  }
};


// Brand controller 🎈

exports.brandIndex = async (req, res, next) => {
  const brands = await Brand.find()
    .sort({ _id: -1 })
    .select("name description shop");

  res.status(200).json({
    data: brands,
  });
};


exports.insertBrand = async (req, res, next) => {
  try {
    const { name, description, shop } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const checkBrand = await Shop.findOne({ _id: shop });
    if (!checkBrand) {
      const error = new Error("Shop not founded.❗");
      error.statusCode = 400;
      throw error;
    }

    // set state value
    const brand = new Brand();
    brand.name = name;
    brand.description = description;
    brand.shop = shop;

    // save
    await brand.save();

    res.status(201).json({
      message: `Insert Brand : ${name} ✔ Successfully.`,
    });
  } catch (err) {
    next(err);
  }
};


exports.showBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const brand = await Brand.findById(id);

    if (!brand) {
      const error = new Error("Brand not founded ❗");
      error.statusCode = 400;
      throw error;
    }

    const setBrand = {
      id: brand._id,
      name: brand.name,
      description: brand.description,
    };

    if (!brand) {
      const error = new Error("Brand not founded ❗");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      data: setBrand,
    });
  } catch (err) {
    next(err);
  }
};

exports._item = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const headphones = await Headphone.find({
      brand: id,
    }).populate("brand");

    let setHeadPhone = [];
    let brandName;

    headphones.map((headphone) => {
      brandName = headphone.brand.name;
      setHeadPhone = [
        ...setHeadPhone,
        {
          id: headphone.id,
          name: headphone.name,
          detail: headphone.detail,
        },
      ];
    });

    res.status(200).json({
      brand: brandName,
      data: setHeadPhone,
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const brandBefore = await Brand.findById(id);

    //delete check Headphones in brand
    const headphones = await Headphone.find({ brand: id });
    // console.log(headphones);
    if (headphones.length > 0) {
      const error = new Error(
        "Can't no delete brand(have some item in brand)🛑"
      );
      error.statusCode = 400;
      throw error;
    } else {
      const brand = await Brand.findByIdAndDelete(id);

      if (brand.deletedCount === 0) {
        const error = new Error("Don't brand ID in the information. 🏢");
        error.statusCode = 400;
        throw error;
      }

      res.status(200).json({
        message: `Removed Successfully  : ${brandBefore.name} ✔`,
      });
    }
  } catch (error) {
    next(error);
  }
};



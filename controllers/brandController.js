const Brand = require("../models/brand");
const Headphone = require("../models/headphone");
const Shop = require("../models/shop");
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const brands = await Brand.find()
    .sort({ _id: -1 })
    .select("name description shop");

  res.status(200).json({
    data: brands,
  });
};

exports.insert = async (req, res, next) => {
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
      const error = new Error("For this shop ID, there is no data.❗");
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

    headphones.map(headphone => {
      brandName = headphone.brand.name
      setHeadPhone = [
        ...setHeadPhone,
        {
          id: headphone.id,
          name: headphone.name,
          detail: headphone.detail,
        },
      ];
    })

    res.status(200).json({
      brand: brandName,
      data: setHeadPhone,
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

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const beforeUpdate = await Brand.findById(id);

    const brand = await Brand.findByIdAndUpdate(id, {
      name: name || beforeUpdate.name,
      description: description || beforeUpdate.description,
    });

    if (!brand) {
      const error = new Error("brand not founded ❗");
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
    console.log(headphones);
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

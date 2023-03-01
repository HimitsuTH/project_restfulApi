const Headphone = require("@models/headphone");
const Brand = require("@models/brand");
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  try {
    const headphones = await Headphone.find()
      .sort({ _id: -1 })
      .populate("brand");

    let setHeadPhone = [];

    await headphones.map((headphone) => {
      setHeadPhone = [
        ...setHeadPhone,
        {
          id: headphone.id,
          name: headphone.name,
          brand: headphone.brand.name,
          price: headphone.price,
          stock: headphone.stock,
          category: headphone.category,
          description: headphone.description,
          warranty: headphone.warranty,
        },
      ];
    });

    res.status(200).json({
      data: setHeadPhone,
    });
  } catch (err) {
    next(err);
  }
};

exports.insert = async (req, res, next) => {
  try {
    const { name, brand, price, stock, description, category, warranty } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    // check id shop in database
    // if have id --> insert headphones in database || if none -->throw an error

    const checkBrand = await Brand.findOne({ _id: brand });
    if (!checkBrand) {
      const error = new Error("The shop has no data on this brand ID.❗");
      error.statusCode = 400;
      throw error;
    }
    // setState && save
    let headphone = new Headphone({
      name: name,
      brand: brand,
      price: price,
      stock: stock,
      warranty: warranty,
      description: description,
      category: category,
    });

    await headphone.save();

    res.status(201).json({
      message: `Insert product : ${name} 🎧 Successfully.`,
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
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const headphone = await Headphone.findById(id).populate("brand");

    if (!headphone) {
      const error = new Error("headphone not founded ❗");
      error.statusCode = 400;
      throw error;
    }

    const setHeadPhone = [
      {
        id: headphone.id,
        name: headphone.name,
        brand: headphone.brand.name,
        price: headphone.price,
        stock: headphone.stock,
        category: headphone.category,
        description: headphone.description,
        warranty: headphone.warranty,
      },
    ];

    res.status(200).json({
      data: setHeadPhone,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, stock, description, category, warranty } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const headphone = await Headphone.findByIdAndUpdate(id, {
      ...(name && { name: name }),
      ...(price && { price: price }),
      ...(stock && { stock: stock }),
      ...(category && { category: category }),
      ...(description && { description: description }),
      ...(warranty && { warranty: warranty }),
    });

    if (!headphone) {
      const error = new Error("Headphone not founded. ❗");
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
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const headphone = await Headphone.findByIdAndDelete({
      _id: id,
    });

    if (headphone.deletedCount === 0) {
      const error = new Error("Headphone not founded.❗");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: `Deleted Successfully ✔`,
    });
  } catch (error) {
    next(error);
  }
};

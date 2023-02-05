const Brand = require("../model/brand");
const Headphone = require("../model/headphone");
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const brands = await Brand.find().sort({ _id: -1 });

  res.status(200).json({
    data: brands,
  });
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
    // set state value
    const brand = new Brand();
    brand.name = name;
    brand.description = description;

    // save
    await brand.save();

    res.status(200).json({
      message: `Insert Brand : ${name} 🎁 Successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

exports.product = async (req, res, next) => {
  const headphones = await Headphone.find().populate("brand");

  res.status(200).json({
    data: headphones,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const headphone = await Headphone.find({
      brand: id,
    }).select("name detail ");

    const brand = await Brand.findById(id).populate("headphones");

    const setBrand = {
      id: brand._id,
      name: brand.name,
      description: brand.description,
      headphones: headphone,
    };

    // setBrand.headphone = headphone;

    if (!brand) {
      const error = new Error("Brand not founded 🛑");
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

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    // delte brand
    const brandBefore = await Brand.findById(id);
    const brand = await Brand.findByIdAndDelete(id);

    if (brand.deletedCount === 0) {
      const error = new Error("There are no brand ID in the information.");
      error.statusCode = 400;
      throw error;
    }

    //delete Headphones in brand
    const headphones = await Headphone.find({ brand: id });
    headphones?.map(async (hp) => {
      const headphone = await Headphone.deleteOne({
        _id: hp._id,
      });

      if (headphone.deletedCount === 0) {
        const error = new Error(
          "There are no headphones ID in the information."
        );
        error.statusCode = 400;
        throw error;
      }
    });

    res.status(200).json({
      message: `Successfully removed : ${brandBefore.name} ✔`,
    });
  } catch (error) {
    next(error);
  }
};

const Headphone = require("../models/headphone");
const Brand = require("../models/brand");
const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  try {
    const headphones = await Headphone.find()
      .sort({ _id: -1 })
      .populate("brand");

    let setHeadPhone = [];

    headphones.map((headphone) => {
      setHeadPhone = [
        ...setHeadPhone,
        {
          id: headphone.id,
          name: headphone.name,
          brand: {
            id: headphone.brand.id,
            name: headphone.brand.name
          },
          detail: headphone.detail,
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
    const { name, detail, brand } = req.body;

    // check id shop in database
    // if have id --> insert headphones in database || if none -->throw an error

    const checkBrand = await Brand.findOne({ _id: brand });
    if (!checkBrand) {
      const error = new Error("For this brand ID, there is no data.❗");
      error.statusCode = 400;
      throw error;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let headphone = new Headphone();

    headphone.name = name;
    headphone.detail = detail;
    headphone.brand = brand;

    await headphone.save();

    res.status(200).json({
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
    const headphone = await Headphone.findById(id);

    if (!headphone) {
      const error = new Error("headphone not founded ❗");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      data: headphone,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, detail } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information ❗");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const beforeUpdate = await Headphone.findById(id);

    const headphone = await Headphone.findByIdAndUpdate(id, {
      name: name || beforeUpdate.name,
      detail: { ...beforeUpdate.detail, ...detail },
    });

    if (!headphone) {
      const error = new Error("Headphone not founded ❗");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      message: "Updated Successfully",
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

    const beforeDelete = await Headphone.findById(id);
    const headphone = await Headphone.deleteOne({
      _id: id,
    });

    //check log
    // console.log(headphone);
    if (headphone.deletedCount === 0) {
      const error = new Error("There are no headphones ID in the information.");
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json({
      message: `Successfully removed : ${beforeDelete.name} ✔`,
    });
  } catch (error) {
    next(error);
  }
};

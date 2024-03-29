const Shop = require("@models/shop");
const Brand = require("@models/brand");
const Headphone = require("@models/headphone");
const config = require("@config/index");

const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const shops = await Shop.findOne({ _id: config.SHOP_ID }).select(
    "name description address"
  );

  const setShop = {
    id: shops._id,
    name: shops.name,
    description: shops.description,
    address: shops.address,
  };

  res.status(200).json(setShop);
};

// exports.insert = async (req, res, next) => {
//   try {
//     const { name, description } = req.body;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error("received incorrect information.");
//       error.statusCode = 422;
//       error.validation = errors.array();
//       throw error;
//     }

//     let shop = new Shop({
//       name: name,
//       description: description,
//     });

//     await shop.save();

//     res.status(201).json({
//       message: `Insert Shop: ${name} ✔ Successfully`,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.show = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error("received incorrect information.");
//       error.statusCode = 422;
//       error.validation = errors.array();
//       throw error;
//     }
//     const shop = await Shop.findById(id)
//       .populate("brands", "name description")
//       .select("name description");

//     if (!shop) {
//       const error = new Error("Shop not founded ");
//       error.statusCode = 400;
//       throw error;
//     }

//     res.status(200).json({
//       data: shop,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.update = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const shop = await Shop.findByIdAndUpdate(
      { _id: config.SHOP_ID },
      {
        ...(name && { name }),
        ...(description && { description }),
      }
    );

    if (!shop) {
      const error = new Error("Shop not founded.");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      message: `Updated Successfully ✔`,
    });
  } catch (err) {
    next(err);
  }
};

// exports.delete = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const shop = await Shop.deleteOne({ _id: id });

//     if (shop.deletedCount === 0) {
//       const error = new Error("Shop not founded.");
//       error.statusCode = 400;
//       throw error;
//     }

//     res.status(200).json({
//       message: `Deleted Successfully ✔`,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Brand controller 🎈

exports.brandIndex = async (req, res, next) => {
  const brands = await Brand.find()
    .sort({ _id: -1 })
    .select("name description ");

  let setBrand = [];

  await brands.map((brand) => {
    setBrand = [
      ...setBrand,
      {
        id: brand.id,
        name: brand.name,
        description: brand.description,
      },
    ];
  });

  res.status(200).json(setBrand);
};

exports.insertBrand = async (req, res, next) => {
  try {
    const { name, description, shop } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const checkBrandName = await Brand.findOne({ name: name.toLowerCase() });

    if (checkBrandName) {
      const error = new Error("Brand has alrealy exist!");
      error.statusCode = 400;
      throw error;
    }

    const checkShop = await Shop.findOne({ _id: shop });
    if (!checkShop) {
      const error = new Error("Shop not founded.");
      error.statusCode = 400;
      throw error;
    }

    // set state value
    const brand = new Brand({
      name: name,
      description: description,
      shop: shop,
    });

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
      const error = new Error("received incorrect information.");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const brand = await Brand.findOne({ _id: id });

    if (!brand) {
      const error = new Error("Brand not founded.");
      error.statusCode = 400;
      throw error;
    }
    const headphones = await Headphone.find({
      brand: id,
    }).populate("brand");

    let setHeadPhone = [];
    let setBrand = {
      id: brand.id,
      name: brand.name,
    };

    headphones.map((headphone) => {
      setHeadPhone = [
        ...setHeadPhone,
        {
          id: headphone.id,
          name: headphone.name,
          price: headphone.price,
          stock: headphone.stock,
          category: headphone.category,
          description: headphone.description,
          warranty: headphone.warranty,
        },
      ];
    });

    res.status(200).json({
      brand: setBrand,
      headphones: setHeadPhone,
    });
  } catch (err) {
    next(err);
  }
};

// exports._item = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error("received incorrect information.");
//       error.statusCode = 422;
//       error.validation = errors.array();
//       throw error;
//     }

//     const headphones = await Headphone.find({
//       brand: id,
//     }).populate("brand");

//     let setHeadPhone = [];
//     let brandName;

//     headphones.map((headphone) => {
//       brandName = headphone.brand.name;
//       setHeadPhone = [
//         ...setHeadPhone,
//         {
//           id: headphone.id,
//           name: headphone.name,
//           price: headphone.price,
//           stock: headphone.stock,
//           category: headphone.category,
//           description: headphone.description,
//           warranty: headphone.warranty,
//         },
//       ];
//     });

//     res.status(200).json({
//       brand: brandName,
//       data: setHeadPhone,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information.");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    //delete check Headphones in brand
    const headphones = await Headphone.find({ brand: id });
    // console.log(headphones);
    if (headphones.length > 0) {
      const error = new Error("Can't delete brand(have some item in brand)🛑");
      error.statusCode = 400;
      throw error;
    } else {
      const brand = await Brand.deleteOne({ _id: id });
      // console.log(brand);
      if (brand.deletedCount === 0) {
        const error = new Error("Brand ID not founded.");
        error.statusCode = 400;
        throw error;
      }

      res.status(200).json({
        message: `Deleted Successfully ✔`,
      });
    }
  } catch (error) {
    next(error);
  }
};

const Shop = require("../model/shop");
const Headphone = require("../model/headphone");
const config = require("../config/index");

const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const { validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  const shops = await Shop.find()
    .select("name photo location")
    .sort({ _id: -1 });

  const shopWithPhotoDomain = await shops.map((shop, index) => {
    return {
      _id: shop._id,
      name: shop.name,
      photo: `${config.DOMAIN}/images/${shop.photo}`,
      location: shop.location,
    };
  });

  res.status(200).json({
    data: shopWithPhotoDomain,
  });
};

exports.product = async (req, res, next) => {
  const headphones = await Headphone.find().populate("shop");
  // .select('name price')
  // .where('price').gt(200);

  res.status(200).json({
    data: headphones,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id).populate("headphones");

    const hp = await Headphone.find({
      shop: id,
    });



    if (!shop) {
      const error = new Error("Shop not founded!");
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
      photo: photo && (await saveImageToDisk(photo)),
    });

    await shop.save();

    res.status(200).json({
      message: "Insert Shop Successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shop_data = await Shop.findById(id);

    const hp = await Headphone.find({
      shop: id,
    });

    hp?.map(async (data) => {
      if (data.detail.photo != "nopic.png") {
        await deletePhoto(data.detail.photo);
      }
      await data.deleteOne({
        shop: id,
      });
    });

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
    if (shop_data.photo != "nopic.png") {
      await deletePhoto(shop_data.photo);
    }

    res.status(200).json({
      message: `Successfully removed : ${shop_data.name} ✔`,
    });
  } catch (error) {
    next(error);
  }
};

async function saveImageToDisk(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");
  //โฟลเดอร์และ path ของการอัปโหลด
  const uploadPath = `${projectPath}/public/images/`;

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  //เขียนไฟล์ไปไว้ที่ path
  await writeFileAsync(uploadPath + filename, image.data, "base64");
  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}


async function deletePhoto(photo) {
  const projectPath = path.resolve("./");
  const uploadPath = `${projectPath}/public/images/`;

  await fs.unlinkSync(uploadPath + photo);
}
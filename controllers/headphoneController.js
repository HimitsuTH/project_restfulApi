const Headphone = require("../model/headphone");
const { validationResult } = require("express-validator");
const config = require('../config/index');

const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

exports.index = async (req, res, next) => {
  try {
    let headphones = await Headphone.find().sort({ _id: -1 });
    if (headphones.length < 0) {
      const error = new Error("There is no information in the database!!");
      error.statusCode = 400;
      throw error;
    }

    const headphoneWithPhotoDomain = await headphones.map((headphone, index)=> {
      return {
        _id: headphone._id,
        name: headphone.name,
        detail: {
          ...headphone.detail,
          photo: `${config.DOMAIN}${config.PORT}/images/${headphone.detail.photo}`
        },
      };
    })



    res.status(200).json({
      data: headphoneWithPhotoDomain,
    });
  } catch (err) {
    next(err);
  }
};

exports.insert = async (req, res, next) => {
  try {
    const { name, detail } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("received incorrect information!");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let headphone = new Headphone();

    headphone.name = name;
    headphone.detail = {
      ...detail,
      photo: detail.photo && await saveImageToDisk(detail.photo),
    };

    await headphone.save();

    res.status(200).json({
      message: `Insert product : ${name} 🎧 Successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hp = await Headphone.findById(id);
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
    if (hp.detail.photo != "nopic.png") {
      await deletePhoto(hp.detail.photo);
    }



    res.status(200).json({
      message: `Successfully removed : ${hp.name} ✔`,
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
const express = require("express");
let router = express.Router();
const shopController = require("@controllers/shopController");
const passportJWT = require("@middleware/passportJWT").isLogin;
const checkAdmin = require("@middleware/checkAdmin").isAdmin;
const checkId = require("@middleware/checkId").checkId;
const { body } = require("express-validator");


// Get data


router.get("/", shopController.index);
router.get("/brand", shopController.brandIndex);


// Create Router 📍 
router.post(
  "/",
  [ 
    passportJWT, 
    checkAdmin,
    body("name").not().isEmpty().withMessage("Please Enter your name."),
    body("description").not().isEmpty().withMessage("Please Enter some text."),
  ],
  shopController.insert
);
router.post(
  "/brand",
  [
    passportJWT,
    checkAdmin,
    body("name").not().isEmpty().withMessage("Please Enter Brand name❗"),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Please Enter Description❗"),
    body("shop")
      .not()
      .isEmpty()
      .withMessage("Please enter shop ID")
      .exists()
      .withMessage("_id field is required")
      .bail()
      .isMongoId()
      .withMessage("_id must be a valid ObjectId"),
  ],
  shopController.insertBrand
);

//Update Get Delete By ID

router.get("/brand/:id", checkId, shopController.showBrand);
router.get("/brand/:id/_item", checkId, shopController._item);
router.delete(
  "/brand/:id",
  [passportJWT, checkAdmin, checkId],
  shopController.deleteBrand
);

router.get("/:id", checkId, shopController.show);
router.put("/:id", [passportJWT, checkAdmin, checkId], shopController.update);
router.delete("/:id", [passportJWT,checkAdmin, checkId], shopController.delete);





module.exports = router;

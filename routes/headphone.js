const express = require("express");
let router = express.Router();
const { body } = require("express-validator");
const headphoneController = require("@controllers/headphoneController");
const passportJWT = require("@middleware/passportJWT").isLogin;
const checkAdmin = require("@middleware/checkAdmin").isAdmin;
const checkId = require("@middleware/checkValue").checkId;

/* GET users listing. */
router.get("/", headphoneController.index);
router.get("/page?=?:page?", headphoneController.page);
router.post(
  "/",
  [
    passportJWT,
    checkAdmin,
    body("name").not().isEmpty().withMessage("Please enter product name."),
    body("brand")
      .not()
      .isEmpty()
      .withMessage("Please enter brand of headphone")
      .exists()
      .withMessage("_id field is required")
      .bail()
      .isMongoId()
      .withMessage("_id must be a valid ObjectId"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("Please enter price of product")
      .isNumeric()
      .withMessage("Please should enter a number."),
    body("category")
      .not()
      .isEmpty()
      .withMessage("Please enter type of product."),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Please enter the product description."),
    body("stock")
      .optional()
      .isNumeric()
      .withMessage("Please should enter a number."),
  ],
  headphoneController.insert
);

//Update Get Delete By ID

router.get("/:id", checkId, headphoneController.show);
router.put(
  "/:id",
  [passportJWT, checkAdmin, checkId],
  [
    body("price")
      .optional()
      .isNumeric()
      .withMessage("Please should enter a number."),
    body("stock")
      .optional()
      .isNumeric()
      .withMessage("Please should enter a number."),
  ],
  headphoneController.update
);
router.delete(
  "/:id",
  [passportJWT, checkAdmin, checkId],
  headphoneController.delete
);

module.exports = router;

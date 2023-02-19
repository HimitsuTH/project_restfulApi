const express = require("express");
let router = express.Router();
const { body, check } = require("express-validator");
const headphoneController = require("../controllers/headphoneController");
const passportJWT = require("../middleware/passportJWT").isLogin;
const checkAdmin = require("../middleware/checkAdmin").isAdmin;

const checkId = [
  check("id")
    .exists()
    .withMessage("_id field is required")
    .bail()
    .isMongoId()
    .withMessage("_id must be a valid ObjectId"),
];

/* GET users listing. */
router.get("/", headphoneController.index);
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
    body("detail.price")
      .not()
      .isEmpty()
      .withMessage("Please enter price of product")
      .isNumeric("Please should enter a number."),
    body("detail.type")
      .not()
      .isEmpty()
      .withMessage("Please enter type of product."),
    body("detail.description")
      .not()
      .isEmpty()
      .withMessage("Please enter the product description."),
    body("detail.stock")
      .isNumeric()
      .withMessage("Please should enter a number."),
  ],
  headphoneController.insert
);
router.get("/:id", checkId, headphoneController.show);
router.put(
  "/:id",
  [passportJWT, checkAdmin, checkId],
  headphoneController.update
);
router.delete(
  "/:id",
  [passportJWT, checkAdmin, checkId],
  headphoneController.delete
);

module.exports = router;

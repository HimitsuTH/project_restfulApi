const express = require("express");
let router = express.Router();
const { body } = require("express-validator");
const headphoneController = require("../controllers/headphoneController");

/* GET users listing. */
router.get("/", headphoneController.index);

router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Please enter product name."),
    body("detail.type")
      .not()
      .isEmpty()
      .withMessage("Please enter type of product."),
    body("detail.brand")
      .not()
      .isEmpty()
      .withMessage("Please enter brand of product."),
    body("detail.description")
      .not()
      .isEmpty()
      .withMessage("Please enter the product description."),
    body("detail.quantity")
      .isNumeric()
      .withMessage("Please should enter a number."),
  ],
  headphoneController.insert
);


router.delete("/:id", headphoneController.delete)

module.exports = router;

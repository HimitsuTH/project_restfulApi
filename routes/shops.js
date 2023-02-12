const express = require("express");
let router = express.Router();
const shopController = require("../controllers/shopController");
const { body, check } = require("express-validator");

const checkId = [
  check("id")
    .exists()
    .withMessage("_id field is required")
    .bail()
    .isMongoId()
    .withMessage("_id must be a valid ObjectId"),
];

router.get("/", shopController.index);

router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Please Enter your name."),
    body("description").not().isEmpty().withMessage("Please Enter some text."),
  ],
  shopController.insert
);
router.get("/:id",checkId, shopController.show);
router.delete("/:id",checkId, shopController.delete);

module.exports = router;

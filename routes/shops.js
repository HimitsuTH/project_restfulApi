const express = require("express");
let router = express.Router();
const shopController = require("../controllers/shopController");
const { body } = require("express-validator");

router.get("/", shopController.index);
router.get("/:id", shopController.show);
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Please Enter your name."),
    body("description").not().isEmpty().withMessage("Please Enter some text."),
  ],
  shopController.insert
);
router.delete("/:id" , shopController.delete);

module.exports = router;

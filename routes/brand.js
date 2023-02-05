const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const brandController = require("../controllers/brandController");

router.get("/", brandController.index);
router.get("/:id", brandController.show);
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Please Enter Brand name❗"),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Please Enter Description❗"),
  ],
  brandController.insert
);
router.get("/product", brandController.product);
router.delete("/:id", brandController.delete);

module.exports = router;

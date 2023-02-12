const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const brandController = require("../controllers/brandController");

const checkId = [
  check("id")
    .exists()
    .withMessage("_id field is required")
    .bail()
    .isMongoId()
    .withMessage("_id must be a valid ObjectId"),
];

router.get("/", brandController.index);

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

router.get("/:id", checkId, brandController.show);
router.get("/:id/_item",checkId, brandController._item);
router.delete("/:id",checkId, brandController.delete);

module.exports = router;

const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const brandController = require("@controllers/brandController");
const passportJWT = require("@middleware/passportJWT").isLogin;
const checkAdmin = require("@middleware/checkAdmin").isAdmin;

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
  brandController.insert
);

router.get("/:id", checkId, brandController.show);
router.get("/:id/_item", checkId, brandController._item);
router.put("/:id", [passportJWT, checkAdmin, checkId], brandController.update);
router.delete(
  "/:id",
  [passportJWT, checkAdmin, checkId],
  brandController.delete
);

module.exports = router;

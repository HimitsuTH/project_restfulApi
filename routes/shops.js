const express = require("express");
let router = express.Router();
const shopController = require("../controllers/shopController");
const passportJWT = require("../middleware/passportJWT").isLogin;
const checkAdmin = require("../middleware/checkAdmin").isAdmin;
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
    passportJWT, 
    checkAdmin,
    body("name").not().isEmpty().withMessage("Please Enter your name."),
    body("description").not().isEmpty().withMessage("Please Enter some text."),
  ],
  shopController.insert
);
router.get("/:id", checkId, shopController.show);
router.put("/:id", [passportJWT, checkAdmin, checkId], shopController.update);
router.delete("/:id", [passportJWT,checkAdmin, checkId], shopController.delete);

module.exports = router;

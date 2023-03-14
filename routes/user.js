var express = require("express");
var router = express.Router();
const { body } = require("express-validator");
const userController = require("@controllers/userController");
const passportJWT = require("@middleware/passportJWT").isLogin;
const checkAdmin = require("@middleware/checkAdmin").isAdmin;
const checkId = require("@middleware/checkValue").checkId;

/* GET users listing. */
router.get("/", [passportJWT, checkAdmin], userController.index);

router.post(
  "/",
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Please Enter you frist-last name."),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Please Enter Email.")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please Enter Password.")
      .isLength({ min: 6 })
      .withMessage("Password should have more than 5 character."),
  ],
  userController.register
);

router.get("/me", [passportJWT], userController.profile);

//Get Delete By ID

router.post(
  "/login",
  [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Please Enter Email.")
      .isEmail()
      .withMessage("Invalid email format."),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please Enter Password.")
      // .isLength({ min: 6 })
      // .withMessage("Password should have more than 5 character."),
  ],
  userController.login
);

router.put("/me/", passportJWT, userController.update);
router.delete(
  "/:id",
  [passportJWT, checkAdmin, checkId],
  userController.delete
);

module.exports = router;

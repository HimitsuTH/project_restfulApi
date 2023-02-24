var express = require("express");
var router = express.Router();
const { body, check } = require("express-validator");
const userController = require("../controllers/userController");
const passportJWT = require("../middleware/passportJWT").isLogin;


const checkId = [
  check("id")
    .exists()
    .withMessage("_id field is required")
    .bail()
    .isMongoId()
    .withMessage("_id must be a valid ObjectId"),
];

/* GET users listing. */
router.get("/", userController.index);

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
      .withMessage("Email not match"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please Enter Password.")
      .isLength({ min: 5 })
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
      .withMessage("Email not match"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please Enter Password.")
      .isLength({ min: 5 })
      .withMessage("Password should have more than 5 character."),
  ],
  userController.login
);

router.put("/:id" ,[checkId], userController.update);
router.delete("/:id" ,[checkId], userController.delete);

module.exports = router;

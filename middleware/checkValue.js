const { check } = require("express-validator");


module.exports.checkId = [
  check("id")
    .exists()
    .withMessage("_id field is required")
    .bail()
    .isLength({ min: 24, max: 24 })
    .withMessage("_id must be 24 characters long")
    .bail()
    .isMongoId()
    .withMessage("_id must be a valid ObjectId"),
];

module.exports.checkNumber = (value) => {
  return typeof value === "number"
}

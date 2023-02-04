const express = require("express");
const router = express.Router();
// const brandController = require("../controllers/brandController");

router.get("/", (req, res, next) => {
  res.json({
    massage: "Hello, world",
  });
});

module.exports = router;

var router = require("express").Router();
const auth = require("./auth");
const category = require("./category");
const item = require("./item");
const sell = require("./sell");

router.use(auth);
router.use(category);
router.use(item);
router.use(sell);

module.exports = router;
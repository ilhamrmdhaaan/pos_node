const router = require("express").Router();

router.use('/api/v1', require("./v1/index"));

module.exports = router;
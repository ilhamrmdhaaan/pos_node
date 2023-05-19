const router = require("express").Router();
const userController = require("../../controller/user.controller");
const { verifyRefresh } = require("../../middleware/auth")

router.post('/auth/refresh', verifyRefresh);
router.post('/auth', userController.authUser);

module.exports = router;
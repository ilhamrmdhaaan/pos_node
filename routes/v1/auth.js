const router = require("express").Router();
const userController = require("../../controller/user.controller");
const { verifyRefresh } = require("../../middleware/auth")

router.post('/auth/refresh', verifyRefresh);
router.post('/auth', userController.authUser);
router.post('/register', userController.registerUser);
router.post('/auth/forgot', userController.forgotPassword);
router.post('/auth/reset', userController.resetPassword);

module.exports = router;
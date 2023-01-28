const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { catchWrapper } = require("../helpers/errorCatcher");
const {
  postRegister,
  postLogin,
  postLogout,
  verifyEmailController,
  repeatEmailController,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", catchWrapper(postRegister));
router.post("/login", catchWrapper(postLogin));
router.post("/logout", authMiddleware, catchWrapper(postLogout));
router.get("/verify/:verificationToken", catchWrapper(verifyEmailController));
router.post("/verify", catchWrapper(repeatEmailController));

module.exports = router;

const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { validateBody } = require("../middlewares/validateBody");
const { catchWrapper } = require("../helpers/errorCatcher");
const {registerSchema, loginSchema, updateSchema} = require('../service/schemas/user')
const {
  register,
  login,
  logout,
  update,
  verifyEmailController,
  repeatEmailController,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", validateBody(registerSchema), catchWrapper(register));
router.post("/login", validateBody(loginSchema), catchWrapper(login));
router.post("/update",[authMiddleware,validateBody(updateSchema)], catchWrapper(update));
router.post("/logout", authMiddleware, catchWrapper(logout));
router.get("/verify/:verificationToken", catchWrapper(verifyEmailController));
router.post("/verify", catchWrapper(repeatEmailController));

module.exports = router;

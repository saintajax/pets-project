const express = require("express");
// const { authMiddleware } = require("../middlewares/authentifacate");
const { validateBody } = require("../middlewares/validateBody");
const { catchWrapper } = require("../helpers/errorCatcher");
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require("../service/schemas/user");
const {
  register,
  login,
  logout,
  verifyEmailController,
  repeatEmailController,
  refreshTokens,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", validateBody(registerSchema), catchWrapper(register));
router.post("/login", validateBody(loginSchema), catchWrapper(login));
router.post("/logout", validateBody(refreshTokenSchema), catchWrapper(logout));
router.post("/verify", catchWrapper(repeatEmailController));
router.get("/verify/:verificationToken", catchWrapper(verifyEmailController));

router.post(
  "/refresh-tokens",
  validateBody(refreshTokenSchema),
  catchWrapper(refreshTokens)
);

module.exports = router;

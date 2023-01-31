const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { validateBody } = require("../middlewares/validateBody");
const upload = require("../middlewares/upload");
const { catchWrapper } = require("../helpers/errorCatcher");
const {
  registerSchema,
  loginSchema,
  updateSchema,
} = require("../service/schemas/user");
const {
  register,
  login,
  logout,
  update,
  verifyEmailController,
  repeatEmailController,
  getCurrent,
} = require("../controller/authController");

const router = express.Router();

router.post("/register", validateBody(registerSchema), catchWrapper(register));
router.post("/login", validateBody(loginSchema), catchWrapper(login));

router.post(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  validateBody(updateSchema),
  catchWrapper(update)
);

router.post("/logout", authMiddleware, catchWrapper(logout));
router.post("/verify", catchWrapper(repeatEmailController));
router.get("/verify/:verificationToken", catchWrapper(verifyEmailController));
router.get("/current", authMiddleware, catchWrapper(getCurrent));

module.exports = router;

const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { validateBody } = require("../middlewares/validateBody");
const upload = require("../middlewares/upload");
const { catchWrapper } = require("../helpers/errorCatcher");
const { updateSchema } = require("../service/schemas/user");
const {
  update,

  getCurrent,
} = require("../controller/authController");

const router = express.Router();

router.patch(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  validateBody(updateSchema),
  catchWrapper(update)
);
router.get("/current", authMiddleware, catchWrapper(getCurrent));

module.exports = router;

const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { schemas } = require("../service/schemas/notice");
const { validateBody } = require("../middlewares/validateBody");
const { catchWrapper } = require("../helpers/errorCatcher");
const {
  getOwnFavoriteNotices,
  updateFavorites,
  deleteFavorites,
  getAllNotices,
  getNoticeById,
  addNotice,
} = require("../controller/notices");
const upload = require("../middlewares/upload");

const router = express.Router();
router.get("/", authMiddleware, catchWrapper(getAllNotices));
router.get("/favorite", authMiddleware, catchWrapper(getOwnFavoriteNotices));
router.get("/:id", catchWrapper(getNoticeById));
router.post(
  "/addnotice",
  authMiddleware,
  validateBody(schemas.noticesSchema),
  upload.single("noticePhoto"),
  catchWrapper(addNotice)
);
router.patch("/:id/favorites", authMiddleware, catchWrapper(updateFavorites));

router.delete("/:id/favorites", authMiddleware, catchWrapper(deleteFavorites));

module.exports = router;

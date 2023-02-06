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
  getOwnNotice,
  deleteOwnNoticeById,
} = require("../controller/notices");
const upload = require("../middlewares/upload");

const router = express.Router();
router.get("/", catchWrapper(getAllNotices));
router.get("/favorite", authMiddleware, catchWrapper(getOwnFavoriteNotices));
router.get("/:id", catchWrapper(getNoticeById));
router.get("/user/own", authMiddleware, catchWrapper(getOwnNotice));
router.post(
  "/addnotice",
  authMiddleware,
  validateBody(schemas.noticesSchema),
  upload.single("noticePhoto"),
  catchWrapper(addNotice)
);
router.patch("/:id/favorites", authMiddleware, catchWrapper(updateFavorites));

router.delete("/:id/favorites", authMiddleware, catchWrapper(deleteFavorites));
router.delete("/user/:id", authMiddleware, catchWrapper(deleteOwnNoticeById));

module.exports = router;

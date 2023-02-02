const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { schemas } = require("../service/schemas/notice");
const { catchWrapper } = require("../helpers/errorCatcher");
const {
  getOwnFavoriteNotices,
  updateFavorites,
  deleteFavorites,
} = require("../controller/notices");

const router = express.Router();

router.get(
  "/user/favorite",
  authMiddleware,
  catchWrapper(getOwnFavoriteNotices)
);

router.patch(
  "/user/:id/favorites",
  authMiddleware,
  catchWrapper(updateFavorites)
);

router.delete(
  "/user/:id/favorites",
  authMiddleware,
  catchWrapper(deleteFavorites)
);

module.exports = router;

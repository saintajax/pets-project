const express = require("express");
const { authMiddleware } = require("../middlewares/authentifacate");
const { validateBody } = require("../middlewares/validateBody");
const upload = require("../middlewares/upload");
const { catchWrapper } = require("../helpers/errorCatcher");
const { updateSchema } = require("../service/schemas/user");

const {
  update,
  getCurrent,
  getInfo,
  addPet,
  deletePet
} = require("../controller/user");

const router = express.Router();

router.patch(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  validateBody(updateSchema),
  catchWrapper(update)
);
router.get("/current", authMiddleware, catchWrapper(getCurrent));
router.get("/info", authMiddleware, catchWrapper(getInfo));
router.post("/pets/add", authMiddleware, catchWrapper(addPet));
router.patch("/pets/delete/:petId", authMiddleware, catchWrapper(deletePet));



module.exports = router;

const express = require("express");
const getFriends = require("../controller/friends");

const router = express.Router();

router.get("/", getFriends);

module.exports = router;

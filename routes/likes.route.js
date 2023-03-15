const express = require('express');
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

const LikeController = require("../controllers/likes.controller");
const likeController = new LikeController();

router.get("/", authMiddleware, likeController.getMyLikePosts);


module.exports = router;
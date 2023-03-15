const express = require('express');
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

const PostController = require("../controllers/posts.controller");
const postController = new PostController();

router.get("/", postController.getAllPost);
router.get("/:postId", postController.getPostDetail);
router.post("/", authMiddleware, postController.createPost);
router.put("/:postId", authMiddleware, postController.updatePost);
router.delete("/:postId", authMiddleware, postController.deletePost);
router.put("/:postId/like", authMiddleware, postController.likePost);

module.exports = router;

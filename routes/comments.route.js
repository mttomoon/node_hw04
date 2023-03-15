const express = require('express');
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

const CommentController = require("../controllers/comments.controller");
const commentController = new CommentController();

router.post("/:postId", authMiddleware, commentController.createComment);
router.get("/:postId", commentController.getAllComment);
router.put("/:postId/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:postId/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
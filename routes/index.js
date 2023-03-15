const express = require('express');
const router = express.Router();

const usersRouter = require("./users.route");
const postsRouter = require("./posts.route");
const commentsRouter = require("./comments.route");
const likesRouter = require("./likes.route");

router.use('/users', [usersRouter]);
router.use('/posts', [postsRouter]);
router.use('/comments', [commentsRouter]);
router.use('/likes', [likesRouter]);

module.exports = router;
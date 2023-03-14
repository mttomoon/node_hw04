const express = require('express');
const { Op } = require("sequelize");
const { Users, Posts, Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

//게시글 작성
router.post("/posts", authMiddleware, async(req, res)=>{
  try {
    const {userId} = res.locals.user;
    const {title, content} = req.body;

    if (!title || !content) {
      res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
      return;
    }

    await Posts.create({UserId: userId, title, content});
    return res.status(201).json({"message": "게시글을 생성하였습니다."});
  } catch (error) {
    return res.status(404).json({errorMessage: "게시글 작성에 실패하였습니다."});
  }
});

//게시글 전체목록 조회 + 🟩좋아요 갯수도 조회되도록!🟩
router.get("/posts", async (req, res) => {
    try {
      const posts = await Posts.findAll({
        attributes: ["postId", "UserId", "title", "createdAt", "updatedAt"],
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({data : posts});
    } catch (error) {
      res.status(404).json({errorMessage: "게시글 조회에 실패하였습니다."})
    }
  });

//게시글 상세조회
router.get("/posts/:postId", async (req, res) => {
    try {
      const { postId } = req.params;
      const posts = await Posts.findOne({
        attributes: ["postId", "UserId", "title", "content", "createdAt", "updatedAt"],
        include: [
            {
              model: Users,
              attributes: ["nickname"]
            }
        ],
        where: {postId}
      });
  
      res.status(200).json({ "post": posts });
    } catch (error) {
      res.status(404).json({errorMessage: "게시글 조회에 실패하였습니다"})
    }
  });

//게시글 수정
router.put("/posts/:postId", authMiddleware, async(req, res) =>{
    try {
      const {postId} = req.params;
      const {userId} = res.locals.user;
      const {title, content} = req.body;
      const foundPost = await Posts.findOne({where: {postId}});
  
      if (!title || !content) {
        res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
        return;
      }
  
      if(foundPost.UserId === userId) {
        await Posts.update(
            { title, content },
            { where : {[Op.and]: [{postId}, {UserId: userId}]}}
        );
        res.status(200).json({success:true, "message": "게시글을 수정하였습니다."});
      } else {
        res.status(404).json({errorMessage: "게시글 수정 권한이 없습니다."});
      }
    } catch (error) {
      res.status(404).json({errorMessage: "게시글 수정에 실패하였습니다."});
    }
  });

//게시글 삭제
router.delete("/posts/:postId", authMiddleware, async(req, res) =>{
    try {
      const {postId} = req.params;
      const {userId} = res.locals.user;
      const foundPost = await Posts.findOne({ where: { postId } });
  
      if (!foundPost) {
        res.status(400).json({errorMessage: "게시글이 존재하지 않습니다."});
        return;
      }
      if(foundPost.UserId === userId) {
        await Posts.destroy({where: {[Op.and]: [{postId}, {UserId:userId}]}});
        res.status(200).json({success:true, "message": "게시글을 삭제하였습니다."});
      } else {
        res.status(404).json({errorMessage: "게시글 삭제 권한이 없습니다."});
      }
    } catch (error) {
      res.status(404).json({errorMessage: "게시글 삭제에 실패하였습니다."});
    }
});



module.exports = router;
const express = require('express');
const { Op } = require("sequelize");
const { Users, Posts, Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

//댓글 생성
router.post ("/posts/:postId/comments", authMiddleware, async(req, res)=>{
    try {
       const {postId} = req.params;
       const {userId} = res.locals.user;
       const {content} = req.body;
       const post = await Posts.findOne({where:{postId}});
   
       if(!post) {
           return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
       }
       if(!content) {
           return res.status(412).json({errorMessage: "댓글을 작성해주세요."});
       }
   
       await Comments.create({PostId: postId, UserId: userId, content});
       return res.status(201).json({"message": "댓글을 작성하였습니다."});
    } catch (error) {
       console.error(error);
       return res.status(400).json({errorMessage: "댓글 작성에 실패하였습니다."});
    };
   });

//댓글 목록조회
router.get("/posts/:postId/comments", async(req, res)=>{
    try {
        const {postId} = req.params;
        const comments = await Comments.findAll({
            attributes: ["commentId", "UserId", "content", "createdAt", "updatedAt"],
            include: [
                {
                   model: Users,
                   attributes: ["nickname"] 
                }
            ],
            order: [['createdAt', 'DESC']],
            where:{postId}
        });

        res.status(200).json({"comments": comments});
    } catch(error) {
        console.error(error);
       return res.status(400).json({errorMessage: "댓글 목록 조회에 실패하였습니다."});
    }
});


//댓글 수정
router.put("/posts/:postId/comments/:commentId", authMiddleware, async(req, res)=> {
    try {
        const {postId, commentId} = req.params;
        const {userId} = res.locals.user;
        const {content} = req.body;
        const post = await Posts.findOne({where:{postId}});
        const comment = await Comments.findOne({
            where: {[Op.and]: [{PostId: postId}, {commentId}]}
        }); //read만 한 것

        if(!post) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        }
        if(!comment){
            return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."});
        }
        if(!content) {
            return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
        }
        if(comment.UserId !== userId) {
            return res.status(403).json({errorMessage: "게시글 수정 권한이 없습니다."});
        } 
        //업데이트를 하는 역할
        await Comments.update(
            {content},
            {where: 
                {
                    [Op.and]: [{PostId: postId}, {commentId}]
                }
            }
        );
        return res.status(200).json({success:true, "message": "댓글을 수정하였습니다."});

    } catch(error) {
        console.error(error);
        return res.status(400).json({errorMessage: "댓글 수정에 실패하였습니다."});
    };
});

//댓글 삭제
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async(req, res)=>{
    try {
        const {postId, commentId} = req.params;
        const {userId} = res.locals.user;
        const post = await Posts.findOne({where:{postId}});
        const comment = await Comments.findOne({
            where: {[Op.and]: [{PostId: postId}, {commentId}]}
        });

        if(!post) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        }
        if(!comment){
            return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."});
        }
        if(comment.UserId !== userId) {
            return res.status(403).json({errorMessage: "게시글 삭제 권한이 없습니다."});
        } 

        await Comments.destroy({
            where: {
                [Op.and]: [{PostId: postId}, {UserId: userId}, {commentId}]
            }
        });
        return res.status(200).json({success:true, "message": "댓글을 삭제하였습니다."});

    } catch (error) {
        console.error(error);
        return res.status(400).json({errorMessage: "댓글 삭제에 실패하였습니다."});
    };
});

module.exports = router;
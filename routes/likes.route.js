const express = require('express');
const { Op } = require("sequelize");
//실제 데이터베이스와 연결되어진 sequelize, 이것을 사용해 작업이 필요할 경우,아래 모델스에서 가져옴
const { Users, Posts, Comments, Likes, sequelize } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();

//게시글에 좋아요 등록
router.put("/posts/:postId/like", authMiddleware, async(req,res)=>{
    try {
        const {postId} = req.params;
        const {userId} = res.locals.user;
        const post = await Posts.findOne({where: {postId}});
        const likeExist = await Likes.findOne({
            where: {
                [Op.and] : [{PostId: postId}, {UserId: userId}]
            }
        })

        if(!post) {
            return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        }
        if(!likeExist) {
            await Likes.create({PostId: postId, UserId: userId});
            return res.status(200).json({success: true, "message": "게시글에 좋아요를 등록했습니다."})
        } else {
            await Likes.destroy({
                where: {
                    [Op.and]: [{PostId: postId}, {UserId: userId}]
                }
            });
            return res.status(200).json({success: true, "message": "게시글에 좋아요를 취소했습니다."})
        }

    }catch(error) {
        console.error(error);
        return res.status(400).json({errorMessage: "게시글 좋아요에 실패하였습니다."});
    };
});


//내가 좋아요한 게시글 조회
router.get("/like", authMiddleware, async(req, res)=>{
    try {
        const {userId} = res.locals.user;

        const parseLikePostsModel = (likes) => {
            return likes.map((like) => {
              let obj = {};
            //   console.log(like);
              for (const [k, v] of Object.entries(like)) {
                // console.log(k, v);
                if (k.split('.').length > 1) {
                  const key = k.split('.')[1];
                  obj[key] = v;
                } else obj[k] = v;
              }
              return obj;
            })
          }

        const results = await Posts.findAll({
            attributes: ['postId', 'title', 'createdAt', 'updatedAt',
            [sequelize.fn('COUNT', sequelize.col('Likes.PostId')), 'likes']],
            include: [
                {
                    model: Users,
                    attributes: ["nickname", "userId"]
                },
                {
                    model: Likes,
                    attributes: [],
                    required: true,
                    // where: {
                    //   [Op.and]: [{ UserId: userId }],
                    // },
                },
            ],
            group: ['Posts.postId'],
            order: [['createdAt', 'DESC']],
            raw: true,
        }).then((likes) => parseLikePostsModel(likes));
        return res.status(200).json({"posts": results});
    }catch(error) {
        console.error(error);
        return res.status(400).json({errorMessage: "좋아요 게시글 조회에 실패하였습니다."});
    }
});


module.exports = router;
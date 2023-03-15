//실제 데이터베이스와 연결되어진 sequelize, 이것을 사용해 작업이 필요할 경우,아래 모델스에서 가져옴
const { Users, Posts, Comments, Likes, sequelize } = require("../models");
const { Op } = require("sequelize");

class LikeRepository {
    constructor() {}

//좋아요 여부 확인
getlikeExist = async({postId, userId}) => {
   const likeExist = await Likes.findOne({
        where: {
            [Op.and] : [{PostId: postId}, {UserId: userId}]
        }
    });
    return likeExist;
};

//게시글에 좋아요 등록
putLike = async({postId, userId}) => {
    await Likes.create({PostId: postId, UserId: userId});
};

//게시글에 좋아요 취소
cancelLike = async({postId, userId}) => {
    await Likes.destroy({
        where: {
            [Op.and]: [{PostId: postId}, {UserId: userId}]
        }
    });
};

};

module.exports = LikeRepository;
const { Users, Posts, Comments, sequelize } = require("../models");
const { Op } = require("sequelize");

class CommentRepository {
    constructor () {}

createComment = async({postId, userId, content}) => {
    const comment = await Comments.create({PostId:postId, UserId:userId, content});
    return comment;
};

getAllComment = async({postId}) => {
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
    return comments;
};

getOneComment = async({postId, commentId}) => {
    const comment = await Comments.findOne({
                    where: {
                        [Op.and]: [{PostId: postId}, {commentId}]
                    }
                });
    return comment;
};


updateComment = async ({postId, commentId, content}) => {
    const comment = await Comments.update(
        {content},
        {where: 
            {
                [Op.and]: [{PostId: postId}, {commentId}]
            }
        }
    );
    return comment;
}

deleteComment = async ({postId, commentId}) => {
    const comment = await Comments.destroy({
        where: 
            {
                [Op.and]: [{PostId: postId}, {commentId}]
            }
        }
    );
    return comment;
}

}

module.exports = CommentRepository;
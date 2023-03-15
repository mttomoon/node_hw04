const { Users, Posts, Comments, Likes, sequelize } = require("../models");
const { Op } = require("sequelize");

class PostRepository {
    constructor() {}

    //게시글 작성
    createPost = async({userId, title, content}) => {
        const post = await Posts.create({UserId:userId, title, content});
        return post;
    };

    //게시글 전체목록 조회
    getAllPost = async() => {
        const posts = await Posts.findAll({
            attributes: ['postId', 'UserId', 'title', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: Users,
                    attributes: ['nickname']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        return posts;
    };

    //게시글 상세조회
    getPostDetail = async({postId}) => {
        const post = await Posts.findOne({
            attributes: ["postId", "UserId", "title", "content", "createdAt", "updatedAt"],
            include: [
                {
                model: Users,
                attributes: ["nickname"]
                }
            ],
            where: {postId}
        });
        return post;
    };


    //게시글 수정
    updatePost = async({postId, userId, title, content}) => {
        await Posts.update (
            { title, content },
            { where : {[Op.and]: [{postId}, {UserId: userId}]}}
        );
    };

    //게시글 삭제
    deletePost = async({postId, userId}) => {
        await Posts.destroy ({
            where: {
                [Op.and]: [{postId}, {UserId:userId}]
            }
        });
    };

    //나의 좋아요 게시글 모두 찾기
    getMyLikePosts = async({userId}) => {
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
        };

        const likePosts = await Posts.findAll({
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
                                required: true
                            },
                        ],
                        group: ['Posts.postId'],
                        order: [['createdAt', 'DESC']],
                        raw: true,
                    }).then((likes) => parseLikePostsModel(likes));
        return likePosts;
    };

}

module.exports = PostRepository;

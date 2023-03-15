const PostService = require('../services/posts.service');

class PostController {
    constructor() {
        this.postService = new PostService();
    }

    //게시글 작성
    createPost = async (req, res) => {
        try {
            const {userId} = res.locals.user;
            const {title, content} = req.body;

            if (!title || !content) {
                return res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
            }

            await this.postService.createPost({userId, title, content});
            return res.status(201).json({"message": "게시글을 생성하였습니다."});
        } catch (error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

    //게시글 전체목록 조회
    getAllPost = async (req, res) => {
        try {
            const posts = await this.postService.getAllPost();
            return res.status(200).json({data : posts});
        } catch (error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

    //게시글 상세조회
    getPostDetail = async (req, res) => {
        try {
            const { postId } = req.params;

            const post = await this.postService.getPostDetail({postId});
            res.status(200).json({ "post": post });
        } catch(error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

    //게시글 수정
    updatePost = async(req, res) => {
        try {
            const {postId} = req.params;
            const {userId} = res.locals.user;
            const {title, content} = req.body;

            if (!title || !content) {
                res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
                return;
            }

            await this.postService.updatePost({postId, userId, title, content});
            res.status(200).json({success:true, "message": "게시글을 수정하였습니다."});
        } catch (error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

    //게시글 삭제
    deletePost = async(req, res) => {
        try {
            const {postId} = req.params;
            const {userId} = res.locals.user;

            await this.postService.deletePost({postId, userId});
            res.status(200).json({success:true, "message": "게시글을 삭제하였습니다."});
        } catch(error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

    //게시글에 좋아요 등록, 취소
    likePost = async(req,res) => {
        try {
            const {postId} = req.params;
            const {userId} = res.locals.user;

            const result = await this.postService.likePost({postId, userId});
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

}

module.exports = PostController;
const CommentService = require('../services/comments.service');

class CommentController {
    constructor () {
        this.commentService = new CommentService();
    }

//댓글 작성
createComment = async(req, res) => {
    try {
        const {postId} = req.params;
        const {userId} = res.locals.user;
        const {content} = req.body;

        if(!content) {
            return res.status(412).json({errorMessage: "댓글을 작성해주세요."});
        }
        
        await this.commentService.createComment({postId, userId, content});
        return res.status(201).json({"message": "댓글을 작성하였습니다."});
    } catch(error) {
        console.error(error);
        res.status(error.status || 400).json({ errorMessage: error.message });
    };
};

//댓글 목록 조회
getAllComment = async(req,res) => {
    try {
        const {postId} = req.params;
        const comments = await this.commentService.getAllComment({postId});
        return res.status(201).json({"comments": comments});
    } catch(error) {
        console.error(error);
        res.status(error.status || 400).json({ errorMessage: error.message });
    }
};

//댓글 수정
updateComment = async(req,res) => {
    try {
        const {postId, commentId} = req.params;
        const {userId} = res.locals.user;
        const {content} = req.body;

        if(!content) {
            return res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
        }
        await this.commentService.updateComment({postId, commentId, userId, content});
        return res.status(200).json({success:true, "message": "댓글을 수정하였습니다."});
    } catch (error) {
        console.error(error);
        res.status(error.status || 400).json({ errorMessage: error.message });
    }
};

//댓글 삭제
deleteComment = async (req,res) => {
    try {
        const {postId, commentId} = req.params;
        const {userId} = res.locals.user;

        await this.commentService.deleteComment({postId, commentId, userId});
        return res.status(200).json({success:true, "message": "댓글을 삭제하였습니다."});
    } catch (error) {
        console.error(error);
        res.status(error.status || 400).json({ errorMessage: error.message });
    }
};

};

module.exports = CommentController;
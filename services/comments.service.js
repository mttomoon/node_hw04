const CommentRepository = require('../repositories/comments.repository');
const PostRepository = require('../repositories/posts.repository');
const { ValidationError } = require('../exceptions/index.exception');

class CommentService {
    constructor () {
        this.commentRepository = new CommentRepository(),
        this.postRepository = new PostRepository();
    }

createComment = async({postId, userId, content}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    await this.commentRepository.createComment({postId, userId, content});
    return;
};

getAllComment = async({postId}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    const comments = await this.commentRepository.getAllComment({postId});
    return comments;
};

getOneComment = async({postId, commentId}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    const comment = await this.commentRepository.getOneComment({postId, commentId});
    return comment;
};

updateComment = async({postId, commentId, userId, content}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    const foundComment = await this.getOneComment({postId, commentId});
    if(!foundComment){
        throw new ValidationError('댓글이 존재하지 않습니다.');
    }
    if(foundComment.UserId !== userId) {
        throw new ValidationError('게시글 수정 권한이 없습니다.');
    } 
    await this.commentRepository.updateComment({postId, commentId, content});
    return;
};

deleteComment = async({postId, commentId, userId}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    const foundComment = await this.getOneComment({postId, commentId});
    if(!foundComment){
        throw new ValidationError('댓글이 존재하지 않습니다.');
    }
    if(foundComment.UserId !== userId) {
        throw new ValidationError('게시글 수정 권한이 없습니다.');
    } 
    await this.commentRepository.deleteComment({postId, commentId});
    return;
};

}

module.exports = CommentService;

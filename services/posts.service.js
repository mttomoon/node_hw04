const PostRepository = require('../repositories/posts.repository');
const LikeRepository = require('../repositories/likes.repository');
const { ValidationError } = require('../exceptions/index.exception');

class PostService {
    constructor() {
        this.postRepository = new PostRepository(),
        this.likeRepository = new LikeRepository();
    }

//게시글 작성
createPost = async({userId, title, content}) => {
    const post = await this.postRepository.createPost({userId, title, content});
    return post;
};

//게시글 전체목록 조회
getAllPost = async() => {
    const posts = await this.postRepository.getAllPost();
    return posts;
};

//게시글 상세조회
getPostDetail = async({postId}) => {
    const post = await this.postRepository.getPostDetail({postId});
    return post;
};

//게시글 수정
updatePost = async({postId, userId, title, content}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
        }
    if(foundPost.UserId === userId) {
        await this.postRepository.updatePost({postId, userId, title, content});
        return;
    } else {
        throw new ValidationError('게시글 수정 권한이 없습니다.');
    }
};

//게시글 삭제
deletePost = async({postId, userId}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    if(foundPost.UserId === userId) {
        return await this.postRepository.deletePost({postId, userId});
    } else {
        throw new ValidationError('게시글 삭제 권한이 없습니다.');
    }
};

//게시글에 좋아요 등록
likePost = async({postId, userId}) => {
    const foundPost = await this.postRepository.getPostDetail({postId});
    const likeExist = await this.likeRepository.getlikeExist({postId, userId});
    if (!foundPost) {
        throw new ValidationError('게시글이 존재하지 않습니다.');
    }
    if(!likeExist) {
        await this.likeRepository.putLike({postId, userId});
        return {"message": "게시글에 좋아요를 등록했습니다."}
    } else {
        await this.likeRepository.cancelLike({postId, userId});
        return {"message": "게시글에 좋아요를 취소했습니다."}
    }
};
}

module.exports = PostService;
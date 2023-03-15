const PostRepository = require('../repositories/posts.repository');
const LikeRepository = require('../repositories/likes.repository');
const { ValidationError } = require('../exceptions/index.exception');

class LikeService {
    constructor () {
        this.likeRepository = new LikeRepository(),
        this.postRepository = new PostRepository();
    }

getMyLikePosts = async({userId}) => {
    const likePosts = await this.postRepository.getMyLikePosts({userId});
    return likePosts;
}

}

module.exports = LikeService;
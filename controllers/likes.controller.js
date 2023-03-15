const LikeService = require('../services/likes.service');

class LikeController {
    constructor() {
        this.likeService = new LikeService();
    }

getMyLikePosts = async (req, res) => {
    try {
        const {userId} = res.locals.user;
        const likePosts = await this.likeService.getMyLikePosts({userId});
        return res.status(200).json({"posts": likePosts});
    } catch (error) {
        console.error(error);
        res.status(error.status || 400).json({ errorMessage: error.message });
    }
};

}

module.exports = LikeController;
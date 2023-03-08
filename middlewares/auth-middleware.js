const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
    try {
        const {authorization} = req.cookies;
        const [authType, authToken] = (authorization ?? "").split(" ");

        if(authType !== "Bearer" || !authToken) {
            res.status(400).json({errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."});
            return;
        }
        
        const {userId} = jwt.verify(authToken, "custmized_secret_key");
        const user = await Users.findOne({where: {userId}});

        if(!user) {
            res.status(401).json({errorMessage: "사용자가 존재하지 않습니다."});
            return;
        }
        res.locals.user = user;
        next();
    } catch (error) {
        res.status(400).json({errorMessage: "로그인 후에 이용할 수 있는 기능입니다."});
        res.clearCookie("authorization");
        return;
    }
}
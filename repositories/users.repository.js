const { Users } = require("../models");
const { Op } = require("sequelize");

class UserRepository {
    construtor(){}

    //회원 찾기
    findUser = async({email, nickname}) => {
        const user = await Users.findOne({
            where: {
                [Op.or] : [{email}, {nickname}]
            }
        })
        return user;
    };

    //회원가입
    signup = async({email, nickname, password}) => {
        const user = await Users.create({email, password, nickname});
        return user;
    };

    //로그인
    login = async({email, password}) => {
        const user = await Users.findOne({
            where: {
                [Op.and] : [{email}, {password}]
            }
        })
        return user;
    }
}

module.exports = UserRepository;
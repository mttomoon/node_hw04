const UserRepository = require('../repositories/users.repository');
const jwt = require("jsonwebtoken");
require('dotenv').config();

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    //회원찾기
    findUser = async({email, nickname}) =>{
        const user =  await this.userRepository.findUser({email, nickname});
        return user;
    };

    //회원가입
    signup = async({email, nickname, password}) => {
        const existUser = await this.findUser({email, nickname});
        if(existUser) {
            if(existUser.email === email || existUser.nickname === nickname) {
                res.status(400).json({message: "가입한 적 있는 이메일 또는 닉네임입니다."});
            }
        }

        const user = await this.userRepository.signup({email, nickname, password});
        return user;
    };

    //로그인
    login = async ({email, password}) => {
        const user = await this.userRepository.login({email, password});
        if(user.email !== email) {
            res.status(401).json({errorMessage: "이메일을 확인해주세요."});
            return;
        } else if (user.password !== password) {
            res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
            return;
        }
        const token = jwt.sign({userId: user.userId}, process.env.PRIVATE_KEY);
        return token;
    };
   
}

module.exports = UserService;
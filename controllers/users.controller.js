const UserService = require('../services/users.service');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    //회원가입
    signup = async(req, res) => {
        try {
            const {email, nickname, password, confirmPassword} = req.body;
            const nicknamePattern = /^[a-zA-Z0-9]{3,}$/;

            if (!nicknamePattern.test(nickname)) {
                res.status(400).json({errorMessage: "닉네임은 3자 이상, 영문, 숫자로만 구성되어야합니다."});
                return;
            } else if (password.length <= 4) {
                res.status(400).json({errorMessage: "패스워드는 4글자 이상이어야합니다."});
                return;
              } else if (password.includes(nickname)) {
                res.status(400).json({errorMessage: "패스워드에는 닉네임이 포함되어선 안됩니다."});
                return;
              } else if (password !== confirmPassword) {
                res.status(400).json({"errorMessage": "패스워드가 일치하지 않습니다."});
                return;
              } 
            
            await this.userService.signup({ email, nickname, password });
            return res.status(201).json({success:true, message: "회원 가입에 성공하였습니다." });
        } catch (error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };

    //로그인
    login = async(req, res) => {
        try{
            const {email, password} = req.body;
            // const token = await this.userService.generateToken();
            const token = await this.userService.login({ email, password });
            res.cookie("authorization", `Bearer ${token}`);
            return res.status(200).json({message: "로그인에 성공했습니다."});
        } catch (error) {
            console.error(error);
            res.status(error.status || 400).json({ errorMessage: error.message });
        }
    };
}

module.exports = UserController;
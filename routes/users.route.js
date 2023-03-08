const express = require("express");
const { Op } = require("sequelize");
const { Users } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");

//회원가입
router.post("/users", async (req, res)=>{
    const {email, nickname, password, confirmPassword} = req.body;
    const existUser = await Users.findOne({ where: {[Op.or]:[{email},{nickname}]}});
    const nicknamePattern = /^[a-zA-Z0-9]{3,}$/;

    if (!nicknamePattern.test(nickname)) {
        res.status(400).json({errorMessage: "닉네임은 3자 이상, 영문, 숫자로만 구성되어야합니다."});
        return;
    } else if(existUser) {
        res.status(400).json({message: "가입한 적 있는 이메일 또는 닉네임입니다."});
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
    
    try {
        await Users.create({ email, nickname, password });
        return res.status(201).json({success:true, message: "회원 가입에 성공하였습니다." });
    } catch (error) {
        res.status(404).json({errorMessage: error.message});
    }
});

//로그인하기, 웹토큰 발급받기
router.post("/users/login", async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await Users.findOne({where:{email}});

        if(!user) {
            res.status(401).json({errorMessage: "이메일을 확인해주세요."});
            return;
        } else if (user.password !== password) {
            res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
            return;
        }

        const token = jwt.sign({userId: user.userId}, "custmized_secret_key");
        res.cookie("authorization", `Bearer ${token}`);
        return res.status(200).json({message: "로그인에 성공했습니다."});
} catch (error) {
    res.status(404).json({errorMessage: error.message});
}
})


module.exports = router;
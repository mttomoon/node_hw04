const express = require("express");
const routes = require('./routes');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static("assets"));
app.use('/api',routes);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})
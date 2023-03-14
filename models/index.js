'use strict';
//index.js는 

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
//config파일을 가져옴, 어떤 셋팅을 가져올 것인가를 지정하는 줄(아래)
const config = require(__dirname + '/../config/config.js')[env];
//db 객체를 선언, 초기화해놓음(아래)
const db = {}; 

//sequelize 변수선언
let sequelize;
//개발환경에 따라서 데이터베이스와 연결하는 코드 'new Sequelize' 이 부분이 실행되어야 연결이 됨.
//sequelize는 어느 DB와 연결되었는지 정보가 들어있음.
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//fs는 파일을 읽어오는 모듈, 모든 파일들을 가져와서
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  //각 파일을 돌아가면서 클래스의 이름으로 다 모델들을 가져옴.
  //db.user =user로 db 객체에 클래스들을 다 가져옴.
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

//모델 간의 연관관계들도 모두 가지고 옴.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
//디비 연결 데이터를 프로퍼티 sequelize로 가지고 온 것.
db.sequelize = sequelize;
//대문자는 라이브러리를 넣어준 것.
db.Sequelize = Sequelize;

module.exports = db;

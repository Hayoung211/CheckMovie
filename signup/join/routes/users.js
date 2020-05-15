const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');

//로그인전 메인페이지 불러오기
router.get('/beforeLogin_main.html', function(req, res, next) {
  res.render("users/beforeLogin_main");
});
//로그인전 네이버장르페이지 불러오기
router.get('/beforeLogin_naver_genre.html', function(req, res, next) {
  res.render("users/beforeLogin_naver_genre");
});
//로그인전 넷플릭스페이지 불러오기
router.get('/beforeLogin_netflix_genre.html', function(req, res, next) {
  res.render("users/beforeLogin_netflix_genre");
});
//로그인전 순위페이지 불러오기
router.get('/beforeLogin_ranking.html', function(req, res, next) {
  res.render("users/beforeLogin_ranking");
});
//로그인후 메인페이지 불러오기
router.get('/afterLogin_main.html', function(req, res, next) {
  res.render("users/afterLogin_main");
});
//로그인후 네이버장르페이지 불러오기
router.get('/afterLogin_naver_genre.html', function(req, res, next) {
  res.render("users/afterLogin_naver_genre");
});
//로그인후 넷플릭스장르페이지 불러오기
router.get('/afterLogin_netflix_genre.html', function(req, res, next) {
  res.render("users/afterLogin_netflix_genre");
});
//로그인후 순위페이지 불러오기
router.get('/afterLogin_ranking.html', function(req, res, next) {
  res.render("users/afterLogin_ranking");
});
//나만의 리스트 페이지 불러오기
router.get('/myList.html', function(req, res, next) {
  res.render("users/mylist");
});
//회원가입 페이지 불러오기
router.get('/signup.html', function(req, res, next) {
  res.render("users/sign_up");
});
//로그인페이지 불러오기
router.get('/login.html', function(req, res, next) {
  let session = req.session;

  res.render("users/login", {
    session : session
  });
});

//회원가입&비밀번호 암호화.
router.post("/sign_up", async function(req,res,next){
  let body = req.body;
  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  let result = models.user.create({
    name: body.name,
    email: body.email,
    password: hashPassword,
    salt: salt
  })

  res.redirect("/users/signup.html");
})

//로그인
router.post("/login", async function(req,res,next){
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      name: body.name
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword === hashPassword){
    console.log("비밀번호 일치");
    req.session.email = body.userEmail;
    res.redirect("/users/afterLogin_main.html");
    console.log(req.session.email);
  }
  else{
    console.log("비밀번호 불일치");
    res.redirect("/users/login");
  }
});
//로그아웃
router.get("/logout", function(req,res,next){
  req.session.destroy();
  res.clearCookie('sid');

  res.redirect("/users/beforeLogin_main.html")
})
//네이버 제목 검색.
var client_id = 'BlpJyqmTUhWR1YI1iMTB';
var client_secret ='SWKEJ1aW1Z';
router.get('/search/movie', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/search/movie?query=' + encodeURI(req.query.query) + '&genre=1';
  var request = require('request');
  var options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
   };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

module.exports = router;
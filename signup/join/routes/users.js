const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const fs = require('fs')

//로그인전 메인페이지 불러오기
router.get('/beforeLogin_main.html', function(req, res, next) {
  res.render("users/beforeLogin_main");
});
//로그인전 네이버장르페이지 불러오기
router.get('/beforeLogin_naver_genre.html', function(req, res, next) {
  res.render("users/beforeLogin_naver_genre");
});
//로그인전 네이버장르결과페이지 불러오기
router.get('/beforeLogin_naver_genre_show.html', function(req, res, next) {
    //실시간으로 결과값 읽어오기
    const qq=fs.readFileSync('views/users/result/result.json','utf-8');
    const ww=JSON.parse(qq)
    res.render("users/beforeLogin_naver_genre_show", {data : ww});
  
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
//로그인후 네이버장르페이지리스트 불러오기
router.get('/afterLogin_naver_genre_show.html', function(req, res, next) {
  res.render("users/afterLogin_naver_genre_show");
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
//아이디 찾기 페이지 불러오기
router.get('/findId.html',function(req,res,next){
  res.render("users/findId");
})
//비밀번호 찾기 페이지 불러오기
router.get('/findPwd.html',function(req,res,next){
  res.render("users/findPwd");
})
//비밀번호 찾기
router.post("/findPwd", async function(req,res,next){
  try{
    let body = req.body;

    let result = await models.user.findOne({
      where: {
        email: body.email
      }
    });
    let dbpwd = result.dataValues.password;
    const decipher = crypto.createDecipher('aes-256-cbc','hiddenKey');
    let result2 = decipher.update(dbpwd,'base64','utf8');
    result2+=decipher.final('utf8');
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ms.hy1324@gmail.com',
        pass: 'tbvjwnsldj12'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    let mailOptions = {
      from : 'ms.hy1324@gmail.com',
      to : req.body.email,
      subject: '안녕하세요. CheckMovie입니다.',
      text : '분실하신 비밀번호는'+result2+'입니다. 확인 후 다시 로그인 해주십시오.'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
        console.log('Email sent: '+info.response);
      }
    });
    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    res.write('<script type = "text/javascript" charset="utf-8">alert("분실하신 패스워드가 이메일로 전송되었습니다. 이메일을 확인해주세요!!"); location.href="/users/findId.html"; </script>');
  }catch(error){
    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    res.write('<script type = "text/javascript" charset="utf-8">alert("존재하지 않는 이메일입니다. 다시 입력해주세요!"); location.href="/users/findId.html"; </script>');
  }
})



//아이디 찾기
 router.post("/findId", async function(req,res,next){
  try{
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      email: body.email
    }
  });
   
  let dbId = result.dataValues.name;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ms.hy1324@gmail.com',
      pass: 'tbvjwnsldj12'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  let mailOptions = {
    from : 'ms.hy1324@gmail.com',
    to : req.body.email,
    subject: '안녕하세요. CheckMovie입니다.',
    text : '분실하신 아이디는'+dbId+'입니다. 확인 후 다시 로그인 해주십시오.'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    }else{
      console.log('Email sent: '+info.response);
    }
  });
  res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
  res.write('<script type = "text/javascript" charset="utf-8">alert("분실하신 아이디가 이메일로 전송되었습니다. 이메일을 확인해주세요!"); location.href="/users/findId.html"; </script>');

  }catch(error){
    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    res.write('<script type = "text/javascript" charset="utf-8">alert("존재하지 않는 이메일입니다. 다시 입력해주세요!"); location.href="/users/findId.html"; </script>');
  }
  
})

//회원가입&비밀번호 암호화.
router.post("/sign_up", async function(req,res,next){
  
  let body = req.body;
  let inputPassword = body.password;
  const cipher = crypto.createCipher('aes-256-cbc','hiddenKey');
  let hashPassword = cipher.update(inputPassword,'utf8','base64');
  hashPassword+=cipher.final('base64');
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  //let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
  
    try{
      let result = await models.user.findOne({
        where: {
          name: body.name
          
        }
      });
      let dbpassword = result.dataValues.password;

      res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
      res.write('<script type = "text/javascript" charset="utf-8">alert("아이디 중복입니다. 다른 아이디를 사용해주세요!"); location.href="/users/signup.html"; </script>');
    }catch(error){
      
        try{
          let result2 = await models.user.create({
          name: body.name,
          email: body.email,
          password: hashPassword,
          salt: salt
          });
          res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
          res.write('<script type = "text/javascript" charset="utf-8">alert("회원가입이 완료되었습니다. 로그인 해주세요!"); location.href="/users/signup.html"; </script>');
        } catch(err){
          res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
          res.write('<script type = "text/javascript" charset="utf-8">alert("이메일 중복입니다. 이메일을 다시 입력해주세요!"); location.href="/users/signup.html"; </script>');
        }
      
        
    }
  
  //res.redirect("/users/signup.html");
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
  const cipher = crypto.createCipher('aes-256-cbc','hiddenKey');
  let hashPassword = cipher.update(inputPassword,'utf8','base64');
  hashPassword+=cipher.final('base64');
  
  if(dbPassword === hashPassword){
    console.log("비밀번호 일치");
    req.session.email = body.userEmail;
    res.redirect("/users/afterLogin_main.html");
    console.log(req.session.email);
  }
  else{
    console.log("비밀번호 불일치");
    res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
    res.write('<script type = "text/javascript" charset="utf-8">alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요!"); location.href="/users/login.html"; </script>');
    //res.redirect("/users/login.html");
  
    
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
var genre;
var query;
var start;
router.get('/search/movie', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/search/movie?query=' + encodeURI(req.query.query);
  genre = req.query.genre;
  console.log(req.query); //값 확인용
  
  start = 1;
  console.log(req.query.genre);
  if(query = undefined) {
    query = 'a';
  } else {
    query = req.query.query;
  }
  //네이버 장르 검색 디폴트값 ->'가'
  if(req.query.genre=='-드라마') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=1');
  }
  else if(req.query.genre=='-판타지') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=2');
  }
  else if(req.query.genre=='-서부') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=3";
  }
  else if(req.query.genre=='-공포') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=4";
  }
  else if(req.query.genre=='-로맨스') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=5";
  }
  else if(req.query.genre=='-모험') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=6";
  }
  else if(req.query.genre=='-스릴러') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=7";
  }
  else if(req.query.genre=='-느와르') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=8";
  }
  else if(req.query.genre=='-컬트') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=9";
  }
  else if(req.query.genre=='-다큐멘터리') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=10";
  }
  else if(req.query.genre=='-코미디') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=11";
  }
  else if(req.query.genre=='-가족') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=12";
  }
  else if(req.query.genre=='-미스터리') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=13";
  }
  else if(req.query.genre=='-전쟁') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=14";
  }
  else if(req.query.genre=='-애니메이션') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=15";
  }
  else if(req.query.genre=='-범죄') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=16";
  }
  else if(req.query.genre=='-뮤지컬') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=17";
  }
  else if(req.query.genre=='-SF') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=18";
  }
  else if(req.query.genre=='-액션') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=19";
  }
  else if(req.query.genre=='-무협') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=20";
  }
  else if(req.query.genre=='-에로') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=21";
  }
  else if(req.query.genre=='-서스펜스') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=22";
  }
  else if(req.query.genre=='-서사') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=23";
  }
  else if(req.query.genre=='-블랙코미디') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=24";
  }
  else if(req.query.genre=='-실험') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=25";
  }
  else if(req.query.genre=='-영화카툰') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=26";
  }
  else if(req.query.genre=='-영화음악') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=27";
  }
  else if(req.query.genre=='-영화패러디포스터') {
    api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=28');
  }

  //셀렉트박스 장르값
  for(var i=0; i<=28; i++){
    if(req.query.genre==i){
      var gen = String(i);
      if(req.query.genre!=0){
        api_url = api_url+"&genre="+gen;
      }
    }
  }
  api_url = api_url+"&display=10"
  console.log(api_url)
  var request = require('request');
  var options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
   };
  request.get(options, function (error, response, body) {
    var result = JSON.parse(body);
    //검색결과 제목에 <b> </b> 태그 제거.
    for(var i=0; i<result.display; i++) {
      var op = result.items[i].title.replace('<b>', '')
      op = op.replace('</b>', '');
      result.items[i].title = op;
      var ap = result.items[i].actor.replace('<b>', '')
      ap = ap.replace('</b>', '');
      result.items[i].actor = ap;
      var sp = result.items[i].director.replace('<b>', '')
      sp = sp.replace('</b>', '');
      result.items[i].director = sp;
      console.log(op)
    }
     
    var result2=JSON.stringify(result)
    if (!error && response.statusCode == 200) {
      fs.writeFileSync('views/users/result/result.json',result2);
      res.redirect("/users/beforeLogin_naver_genre_show.html");
      res.end(body);
    }
      else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

router.get('/search/movie/next', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/search/movie?query=' + encodeURI(query);
  console.log(genre); //값 확인용

  console.log(query);
  start+=10;
  console.log(start);
  
  if(query == null) {
    if(genre=='-드라마') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=1');
    }
    else if(genre=='-판타지') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=2');
    }
    else if(genre=='-서부') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=3";
    }
    else if(req.query.genre=='-공포') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=4";
    }
    else if(req.query.genre=='-로맨스') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=5";
    }
    else if(req.query.genre=='-모험') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=6";
    }
    else if(req.query.genre=='-스릴러') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=7";
    }
    else if(req.query.genre=='-느와르') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=8";
    }
    else if(req.query.genre=='-컬트') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=9";
    }
    else if(req.query.genre=='-다큐멘터리') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=10";
    }
    else if(req.query.genre=='-코미디') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=11";
    }
    else if(req.query.genre=='-가족') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=12";
    }
    else if(req.query.genre=='-미스터리') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=13";
    }
    else if(req.query.genre=='-전쟁') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=14";
    }
    else if(req.query.genre=='-애니메이션') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=15";
    }
    else if(req.query.genre=='-범죄') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=16";
    }
    else if(req.query.genre=='-뮤지컬') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=17";
    }
    else if(req.query.genre=='-SF') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=18";
    }
    else if(req.query.genre=='-액션') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=19";
    }
    else if(req.query.genre=='-무협') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=20";
    }
    else if(req.query.genre=='-에로') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=21";
    }
    else if(req.query.genre=='-서스펜스') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=22";
    }
    else if(req.query.genre=='-서사') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=23";
    }
    else if(req.query.genre=='-블랙코미디') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=24";
    }
    else if(req.query.genre=='-실험') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=25";
    }
    else if(req.query.genre=='-영화카툰') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=26";
    }
    else if(req.query.genre=='-영화음악') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=27";
    }
    else if(req.query.genre=='-영화패러디포스터') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=28');
    }
    api_url = api_url + "&start=" + start + "&display=10";
  } else {
    api_url = api_url + "&genre=" + genre  + "&start=" + start + "&display=10";
    console.log(api_url);
  }
  var request = require('request');
  var options = {
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
   request.get(options, function (error, response, body) {
    var result = JSON.parse(body);
    //검색결과 제목에 <b> </b> 태그 제거.
    for(var i=0; i<result.display; i++) {
      var op = result.items[i].title.replace('<b>', '')
      op = op.replace('</b>', '');
      result.items[i].title = op;
      var ap = result.items[i].actor.replace('<b>', '')
      ap = ap.replace('</b>', '');
      result.items[i].actor = ap;
      var sp = result.items[i].director.replace('<b>', '')
      sp = sp.replace('</b>', '');
      result.items[i].director = sp;
      console.log(op)
    }
     
    var result2=JSON.stringify(result)
    if (!error && response.statusCode == 200) {
      fs.writeFileSync('views/users/result/result.json',result2);
      res.redirect("/users/beforeLogin_naver_genre_show.html");
      res.end(body);
    }
      else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

router.get('/search/movie/prev', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/search/movie?query=' + encodeURI(query);
  console.log(genre); //값 확인용

  console.log(query);
  start-=10;
  console.log(start);
  if(query == null) {
    if(genre=='-드라마') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=1');
    }
    else if(genre=='-판타지') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=2');
    }
    else if(genre=='-서부') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=3";
    }
    else if(req.query.genre=='-공포') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=4";
    }
    else if(req.query.genre=='-로맨스') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=5";
    }
    else if(req.query.genre=='-모험') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=6";
    }
    else if(req.query.genre=='-스릴러') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=7";
    }
    else if(req.query.genre=='-느와르') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=8";
    }
    else if(req.query.genre=='-컬트') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=9";
    }
    else if(req.query.genre=='-다큐멘터리') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=10";
    }
    else if(req.query.genre=='-코미디') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=11";
    }
    else if(req.query.genre=='-가족') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=12";
    }
    else if(req.query.genre=='-미스터리') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=13";
    }
    else if(req.query.genre=='-전쟁') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=14";
    }
    else if(req.query.genre=='-애니메이션') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=15";
    }
    else if(req.query.genre=='-범죄') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=16";
    }
    else if(req.query.genre=='-뮤지컬') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=17";
    }
    else if(req.query.genre=='-SF') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=18";
    }
    else if(req.query.genre=='-액션') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=19";
    }
    else if(req.query.genre=='-무협') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=20";
    }
    else if(req.query.genre=='-에로') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=21";
    }
    else if(req.query.genre=='-서스펜스') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=22";
    }
    else if(req.query.genre=='-서사') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=23";
    }
    else if(req.query.genre=='-블랙코미디') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=24";
    }
    else if(req.query.genre=='-실험') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=25";
    }
    else if(req.query.genre=='-영화카툰') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=26";
    }
    else if(req.query.genre=='-영화음악') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가')+"&genre=27";
    }
    else if(req.query.genre=='-영화패러디포스터') {
      api_url = 'https://openapi.naver.com/v1/search/movie?query='+ encodeURI('가&genre=28');
    }
    api_url = api_url + "&start=" + start + "&display=10";
  } else {
    api_url = api_url + "&genre=" + genre  + "&start=" + start + "&display=10";
    console.log(api_url);
  }
  var request = require('request');
  var options = {
      url: api_url,
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
   };
   request.get(options, function (error, response, body) {
    var result = JSON.parse(body);
    //검색결과 제목에 <b> </b> 태그 제거.
    for(var i=0; i<result.display; i++) {
      var op = result.items[i].title.replace('<b>', '')
      op = op.replace('</b>', '');
      result.items[i].title = op;
      var ap = result.items[i].actor.replace('<b>', '')
      ap = ap.replace('</b>', '');
      result.items[i].actor = ap;
      var sp = result.items[i].director.replace('<b>', '')
      sp = sp.replace('</b>', '');
      result.items[i].director = sp;
      console.log(op)
    }
     
    var result2=JSON.stringify(result)
    if (!error && response.statusCode == 200) {
      fs.writeFileSync('views/users/result/result.json',result2);
      res.redirect("/users/beforeLogin_naver_genre_show.html");
      res.end(body);
    }
      else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});


module.exports = router;
const express = require('express');
const router = express.Router();
const models = require("../models");

var app = express();

app.listen(3000);

router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});


router.post("/sign_up", function(req,res,next){
  let body = req.body;

  models.user.create({
    name: body.userName,
    email: body.userEmail,
    password: body.password
  })
  .then( result => {
    res.redirect("/users/sign_up");
  })
  .catch( err => {
    console.log(err)
  })
})

module.exports = router;

var client_id = 'BlpJyqmTUhWR1YI1iMTB';
var client_secret ='SWKEJ1aW1Z';
router.get('/search/movie', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/search/movie?query=' + encodeURI(req.query.query);
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

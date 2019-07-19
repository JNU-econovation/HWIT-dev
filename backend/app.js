//module
const express = require("express");
const fs = require("fs");
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


// 에러 헨들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//mongoose 모듈사용
var mongoose = require('mongoose');

var database;

// //변수
  const app = express();
  const port = process.env.PORT || 3000;

//데이터베이스에 연결
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017/local';
	
	mongoose.Promise= global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('open', function(){
        console.log('데이터베이스에 연결됨: '+databaseUrl);
        
       UserSchema=mongoose.Schema({
            email: String,
            password: String,
            repassword: String
        });
        
        console.log('UserSchema 정의함. ');
        
        
        UserModel= mongoose.model('touser', UserSchema);
        console.log('UserModel 정의함. ');
    });
    
    database.on('disconnected',function(){
        console.log('데이터베이스 연결 끊어짐.');
    });

    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
        
}
//var app=express();
app.set('port', process.env.PORT || 3000);

app.use('/',static(path.join(__dirname,'')));
app.use('/frontend',static(path.join(__dirname,'')));
app.use('/backend',static(path.join(__dirname,'')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(cookieParser());

app.use(expressSession({
 key: 'sid', 
  secret: 'my key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}))





var router = express.Router();

// router.route('/').get(function(req,res){
//     var user = req.session.user;
//     res.render('/index2',{
//         user : user 
//     });
// });



router.route('/process/login').post(function(req,res){ //요청 객체와 응답객체를 파라미터로 받음
    console.log('/process/login 라우팅 함수 호출');
     
    var paramId = req.body.userEmail || req.query.userEmail;
    var paramPassword = req.body.userPassword ||req.query.userPassword;
     console.log('요청 파라미터: '+paramId+ ','+paramPassword);
     
     if(database){
         authUser(database, paramId, paramPassword,function(err,docs){
             if(err){

                 console.log('에러 발생');
                 res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                 res.write('<h1>에러 발생</h1>');
                 res.end();
                 return ;
             }
             
             if(docs){
                 console.dir(docs);
                req.session.user =paramId;
                console.log(req.session.user);
                
                //res.redirect('/',200);                

                //  res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                //  res.write('<h1>사용자 로그인 성공</h1>');
                //  res.write('<div><p>사용자: '+docs[0].email +'</p></div>');
                //  res.write('<br><br><a herf="http://localhost:3000/index2.html">다시 로그인하기 </a>');
                //  res.end();
                res.redirect('/plan.html');
          
             }else{ //데이터 값이 null
                 console.log('에러 발생');
                 res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                 res.write('<h1>사용자 데이터 조회 안됨</h1>');
                 res.end();
             }
             
         });
     }else{ //database 연결이 안되었을때
            console.log('에러 발생');
             res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
             res.write('<h1>데이터베이스 연결 안됨.</h1>');
             res.end();
     }
 });

 router.route('/process/logout').get(function(req,res){
     if(req.session.user){
         console.log('로그아웃 처리');
         req.session.destroy(
             function(err){
                 if(err){
                     console.log('세션 삭제시 에러');
                     return;
                 }
                 console.log('세션 삭제 성공');
                 res.redirect('/index.html');

             }
         );
     }else{
         console.log('로그인 안되어 있음');
         res.redirect('/index.html');
     }

     }
 );

 router.route('/process/logout').post(function(req,res){ 
    console.log('/process/logout 라우팅 함수 호출');

    // req.session.destroy();
    // res.clearCookie('sid');

    if (req.session.user) {
        console.log('로그아웃 처리');
        req.session.destroy(
            function (err) {
                if (err) {
                    console.log('세션 삭제시 에러');
                    return;
                }
                console.log('세션 삭제 성공');
                
                res.redirect('/index.html');
            }
        );          

    } 




    res.redirect('/');
    
 });


 router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser 라우팅 함수 호출됨.');
    
    var paramId = req.body.userEmail || req.query.userEmail;
    var paramPassword = req.body.userPassword ||req.query.userPassword;
    var reparamPassword = req.body.reuserPassword ||req.query.reuserPassword;
    
    

    console.log(' 요청 파라미터 :' +paramId+ ','+paramPassword+','+reparamPassword);
    
    if(database){
        addUser(database,paramId,paramPassword, reparamPassword,
               function(err,result){
            if(err){
                console.log('에러 발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>에러 발생</h1>');
                res.end();
                return ;
                
            }
            if(result){
                console.dir(result);
                
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>회원가입 완료</h1>');
                res.write('<div><p>사용자: '+paramId +'</p></div>');
                res.write('<a href="http://localhost:3000/index2">사이트로 돌아가기</a>');
                res.end();
         
            }else{ 
                console.log('에러 발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안됨</h1>');
                res.end();
            }
            
        })
    }else{
        console.log('에러 발생');
            res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>데이터베이스 연결 안됨.</h1>');
            res.end();
        
        
    }
                
        
    
});



app.use('/',router);
app.use('/public/',router);

//database를 다루는 함수 정의
var authUser = function(db, id, password, callback){
    console.log('authUser 호출됨: '+id+','+password);
    
    
    UserModel.find({"email":id,"password":password}, function(err,docs)
    {
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length>0){ //에러발생안함
            console.log('일치하는 사용자를 찾음.');
            callback(null, docs);
        }else{
            console.log('일치하는 사용자를 찾지 못함');
            callback(null,null);
        }        
        
        
    });
    
};


var addUser = function(db, id, password, repassword, callback) {
	console.log('addUser 호출됨 : ' + id + ', ' + password+ ', ' + password );
	
    var user=new UserModel({"email":id, "password":password, "repassword":repassword});
    
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log('사용자 데이터 추가함.');
        callback(null,user);  
    	
	});
};

var errorHandler=expressErrorHandler({
    static: {
        '404': '../frontend/404.html'
    }
});


app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);



var server = http.createServer(app).listen(app.get('port'),function()
{
    console.log('익스프레스로 웹 서버를 실행함: '+app.get('port'));

    connectDB();
}); 

//설정
app.use(express.static("./frontend"));

//get 요청
app.get("/", (req, res) => {
  console.log("get(/)요청 실행");
  fs.readFile("./frontend/index.html", (err, data) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(data);
  });
});

app.get("/plan", (req, res) => {
  console.log("get(/plan)요청 실행");

  fs.readFile("./frontend/plan.html", (err, data) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(data);
  });
});

app.get("/process/plan", (req, res) => {
  console.log("get(/process/plan)요청 실행");

  fs.readFile("./frontend/polylineEX.html", (err, data) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(data);
  });
});

// //error
// app.all("*", (req, res) => {
//   res.status(404).send("<h1>요청하신 페이지는 없어요.</h1>");
// });

// //서버 실행
// app.listen(port, () => {
//   console.log("서버가 실행됨. " + port);

//   connectDB();
// });

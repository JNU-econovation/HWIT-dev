//module
const express = require("express");
const router = express.Router();
const http = require("http");
const static = require("serve-static");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressErrorHandler = require("express-error-handler");
const mongoose = require("mongoose");

var database;

// //변수
const app = express();

//설정
app.set("port", process.env.PORT || 3000);
app.use(express.static("./frontend"));
app.use("/", static(path.join(__dirname, "")));
app.use("/frontend", static(path.join(__dirname, "")));
app.use("/backend", static(path.join(__dirname, "")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//데이터베이스에 연결
function connectDB() {
  // 데이터베이스 연결 정보
  var databaseUrl =
    "mongodb+srv://hwit:ecnv2019@cluster0-qvtb7.mongodb.net/test?retryWrites=true&w=majority";

  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl, { useNewUrlParser: true });
  database = mongoose.connection;

  database.on("open", function() {
    console.log("데이터베이스에 연결됨: " + databaseUrl);

    UserSchema = mongoose.Schema({
      email: String,
      password: String,
      repassword: String
    });

    console.log("UserSchema 정의함. ");

    UserModel = mongoose.model("touser", UserSchema);
    console.log("UserModel 정의함. ");
  });

  database.on("disconnected", function() {
    console.log("데이터베이스 연결 끊어짐.");
  });

  database.on("error", console.error.bind(console, "mongoose 연결 에러."));
}

app.use(
  expressSession({
    key: "sid",
    secret: "my key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
  })
);

// router.route('/').get(function(req,res){
//     var user = req.session.user;
//     res.render('/index2',{
//         user : user
//     });
// });

router.post("/process/login", function(req, res) {
  //요청 객체와 응답객체를 파라미터로 받음
  console.log("/process/login 라우팅 함수 호출");

  var paramId = req.body.userEmail || req.query.userEmail;
  var paramPassword = req.body.userPassword || req.query.userPassword;
  console.log("요청 파라미터: " + paramId + "," + paramPassword);

  if (database) {
    authUser(database, paramId, paramPassword, function(err, docs) {
      if (err) {
        console.log("에러 발생");
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>에러 발생</h1>");
        res.end();
        return;
      }

      if (docs) {
        console.dir(docs);
        req.session.user = paramId;
        console.log(req.session.user);

        res.redirect("/plan");
      } else {
        console.log("사용자 데이터 조회 안됨");
        res.redirect("/");
      }
    });
  } else {
    console.log("데이터베이스 연결 안됨.");
  }
});

var page = require("./router/page.js")(app);
var processPage = require("./router/process.js")(app);
app.use("/", page);
app.use("/process", processPage);

router.get("/process/logout", (req, res) => {
  if (req.session.user) {
    console.log("로그아웃 처리");
    req.session.destroy(err => {
      if (err) {
        console.log("세션 삭제시 에러");
        return;
      }
      console.log("세션 삭제 성공");
      res.redirect("/index.html");
    });
  } else {
    console.log("로그인 안되어 있음");
    res.redirect("/index.html");
  }
});

router.route("/process/logout").post(function(req, res) {
  console.log("/process/logout 라우팅 함수 호출");

  // req.session.destroy();
  // res.clearCookie('sid');

  if (req.session.user) {
    console.log("로그아웃 처리");
    req.session.destroy(function(err) {
      if (err) {
        console.log("세션 삭제시 에러");
        return;
      }
      console.log("세션 삭제 성공");

      res.redirect("/index.html");
    });
  }

  res.redirect("/");
});

router.route("/process/adduser").post(function(req, res) {
  console.log("/process/adduser 라우팅 함수 호출됨.");

  var paramId = req.body.userEmail || req.query.userEmail;
  var paramPassword = req.body.userPassword || req.query.userPassword;
  var reparamPassword = req.body.reuserPassword || req.query.reuserPassword;

  console.log(" 요청 파라미터 :" + paramId + "," + paramPassword + "," + reparamPassword);

  if (database) {
    addUser(database, paramId, paramPassword, reparamPassword, function(err, result) {
      if (err) {
        console.log("에러 발생");
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>에러 발생</h1>");
        res.end();
        return;
      }
      if (result) {
        console.dir(result);

        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>회원가입 완료</h1>");
        res.write("<div><p>사용자: " + paramId + "</p></div>");
        res.write('<a href="http://localhost:3000/index2">사이트로 돌아가기</a>');
        res.end();
      } else {
        console.log("에러 발생");
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>사용자 추가 안됨</h1>");
        res.end();
      }
    });
  } else {
    console.log("에러 발생");
    res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
    res.write("<h1>데이터베이스 연결 안됨.</h1>");
    res.end();
  }
});

//database를 다루는 함수 정의
var authUser = function(db, id, password, callback) {
  console.log("authUser 호출됨: " + id + "," + password);

  UserModel.find({ email: id, password: password }, function(err, docs) {
    if (err) {
      callback(err, null);
      return;
    }
    if (docs.length > 0) {
      //에러발생안함
      console.log("일치하는 사용자를 찾음.");
      callback(null, docs);
    } else {
      console.log("일치하는 사용자를 찾지 못함");
      callback(null, null);
    }
  });
};

var addUser = function(db, id, password, repassword, callback) {
  console.log("addUser 호출됨 : " + id + ", " + password + ", " + password);

  var user = new UserModel({ email: id, password: password, repassword: repassword });

  user.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }
    console.log("사용자 데이터 추가함.");
    callback(null, user);
  });
};

var errorHandler = expressErrorHandler({
  static: {
    "404": "./frontend/404.html"
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get("port"), function() {
  console.log("익스프레스로 웹 서버를 실행함: " + app.get("port"));
  connectDB();
});

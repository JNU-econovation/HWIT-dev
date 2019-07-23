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
const fs = require("fs");
const methodOverride = require("method-override");

var database;

// //변수
const Schema = mongoose.Schema;
const app = express();
const databaseUrl =
  "mongodb+srv://hwit:ecnv2019@cluster0-qvtb7.mongodb.net/test?retryWrites=true&w=majority";
var databaseUtil = require("./util/database.js");

//설정
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("./frontend"));
app.use("/", static(path.join(__dirname, "views/plan")));
app.use("/frontend", static(path.join(__dirname, "")));
app.use("/backend", static(path.join(__dirname, "")));
//app.use("/posts", static(path.join(__dirname, "./backend/views/posts")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  expressSession({
    key: "sid",
    secret: "my key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
    }
  })
);

//get, post
var page = require("./router/page.js")(app);
var processPage = require("./router/process.js")(app);
app.use("/", page);
app.use("/process", processPage);

//데이터베이스에 연결
connectDB = () => {
  // 데이터베이스 연결 정보
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl, { useNewUrlParser: true });
  database = mongoose.connection;

  database.on("open", () => {
    console.log("데이터베이스에 연결됨: " + databaseUrl);

    const UserSchema = Schema({
      email: String,
      password: String,
      repassword: String,
      Plans: [{ type: Schema.Types.ObjectId, ref: "Plan" }]
    });

    const PlanSchema = Schema({
      title: String,
      Schedules: [{ type: Schema.Types.ObjectId, ref: "Schedule" }]
    });

    const ScheduleSchema = Schema({
      depplacename: String,
      arrplacename: String,
      depplandtime: String,
      arrplandtime: String,
      traingradename: String
    });

    console.log("UserSchema 정의함. ");
    ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
    UserModel = mongoose.model("touser", UserSchema);
    PlanModel = mongoose.model("Plan", PlanSchema);
    console.log("UserModel 정의함. ");
  });

  database.on("disconnected", () => {
    console.log("데이터베이스 연결 끊어짐.");
  });

  database.on("error", console.error.bind(console, "mongoose 연결 에러."));
};

app.post("/process/login", (req, res) => {
  //요청 객체와 응답객체를 파라미터로 받음
  console.log("/process/login 라우팅 함수 호출");

  var paramId = req.body.userEmail || req.query.userEmail;
  var paramPassword = req.body.userPassword || req.query.userPassword;
  console.log("요청 파라미터: " + paramId + "," + paramPassword);

  if (database) {
    databaseUtil.authUser(database, paramId, paramPassword, (err, docs) => {
      if (err) {
        console.log("에러 발생");
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>에러 발생</h1>");
        res.end();
        return;
      }

      if (docs) {
        req.session.user = paramId;
        console.log(req.session.user);
        req.session.save(() => {
          res.redirect("/plan");
        });
      } else {
        console.log("사용자 데이터 조회 안됨");
        res.redirect("/");
      }
    });
  } else {
    console.log("데이터베이스 연결 안됨.");
  }
});

app.get("/process/schedule/save", (req, res) => {
  console.log("get(process/schedule/save)요청 실행됨");

  const title = req.session.title;

  const depplacename = req.query.depplacename;
  const arrplacename = req.query.arrplacename;
  const depplandtime = req.query.depplandtime;
  const arrplandtime = req.query.arrplandtime;
  const traingradename = req.query.traingradename;

  console.log(
    title + " : " + depplacename + "/" + arrplacename + "/" + depplandtime + "/" + arrplandtime
  );
  databaseUtil.addSchedule(
    database,
    title,
    depplacename,
    arrplacename,
    depplandtime,
    arrplandtime,
    traingradename
  );
  fs.readFile("./frontend/close.html", (err, data) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(data);
  });
});

app.get("/process/plan", (req, res) => {
  console.log("get(/process/plan)요청 실행");

  const title = req.query.title;
  console.log("계획 제목 : " + title);
  req.session.title = title;

  //plan db 저장
  databaseUtil.addPlan(database, req.session.user, title);
  fs.readFile("./frontend/polylineEX.html", (err, data) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(data);
  });
});

app.post("/process/adduser", (req, res) => {
  console.log("/process/adduser 라우팅 함수 호출됨.");

  var paramId = req.body.userEmail || req.query.userEmail;
  var paramPassword = req.body.userPassword || req.query.userPassword;
  var reparamPassword = req.body.reuserPassword || req.query.reuserPassword;

  console.log(" 요청 파라미터 :" + paramId + "," + paramPassword + "," + reparamPassword);

  if (database) {
    databaseUtil.addUser(database, paramId, paramPassword, reparamPassword, (err, result) => {
      if (err) {
        console.log("에러 발생");
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write("<h1>에러 발생</h1>");
        res.end();
        return;
      }
      if (result) {
        //console.dir(result);
        console.log("사용자 추가됨");

        res.redirect("/");
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

//에러 처리
var errorHandler = expressErrorHandler({
  static: {
    "404": "./frontend/404.html"
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//서버 생성
http.createServer(app).listen(app.get("port"), () => {
  console.log("익스프레스로 웹 서버를 실행함: " + app.get("port"));
  connectDB();
});

module.exports = app => {
  var express = require("express");
  var fs = require("fs");
  var mongoose = require("mongoose");
  var router = express.Router();

  router.get("/plan", (req, res) => {
    console.log("get(/process/plan)요청 실행");

    fs.readFile("./frontend/polylineEX.html", (err, data) => {
      if (err) throw err;

      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.end(data);
    });
  });

  router.get("/logout", (req, res) => {
    console.log("get(/process/logout) 라우팅 함수 호출");

    if (req.session.user) {
      console.log("로그아웃 처리");
      req.session.destroy(err => {
        if (err) {
          console.log("세션 삭제시 에러");
          return;
        }
        console.log("세션 삭제 성공");
        res.redirect("/");
      });
    } else {
      console.log("로그인 안되어 있음");
      res.redirect("/");
    }
  });

  router.post("/logout", (req, res) => {
    console.log("post(/process/logout) 라우팅 함수 호출");

    if (req.session.user) {
      console.log("로그아웃 처리");
      req.session.destroy(err => {
        if (err) {
          console.log("세션 삭제시 에러");
          return;
        }
        console.log("세션 삭제 성공");

        res.redirect("/");
      });
    }

    res.redirect("/");
  });

  return router;
};

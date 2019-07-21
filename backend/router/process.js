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

  router.post("/schedule", (req, res) => {
    console.log("post(/process/plan/schedule)요청 실행");
    const TrainApi = require("../TrainApi.js");
    const apihtml = require("../util/schedule.js");
    const dateUtil = require("../util/date.js");

    let departureLocation = req.body.departureLocation;
    let departureStation = req.body.departureStation;
    let arrivalLocation = req.body.arrivalLocation;
    let arrivalStation = req.body.arrivalStation;
    let date = req.body.date; //2016-11-30

    let data;

    (async () => {
      try {
        data = await TrainApi(
          departureLocation,
          departureStation,
          arrivalLocation,
          arrivalStation,
          dateUtil.dateToStr(date),
          "01"
        );

        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        console.log(data);

        res.end(apihtml.popup(data));
      } catch (err) {
        console.log(err);
      }
    })();
  });
  return router;
};

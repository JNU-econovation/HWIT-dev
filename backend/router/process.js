module.exports = (app, database) => {
  const express = require("express");
  const fs = require("fs");
  const mongoose = require("mongoose");
  const router = express.Router();
  const databaseUtil = require("../util/database.js");

  router.get("/plan", (req, res) => {
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
    const TrainApi = require("../api/TrainApi.js");
    const apihtml = require("../util/schedule.js");
    const dateUtil = require("../util/date.js");

    let departureLocation = req.body.departureLocation;
    let departureStation = req.body.departureStation;
    let arrivalLocation = req.body.arrivalLocation;
    let arrivalStation = req.body.arrivalStation;
    let date = req.body.date; //2016-11-30
    console.log(
      departureLocation +
        "/" +
        departureStation +
        "/" +
        arrivalLocation +
        "/" +
        arrivalStation +
        "/" +
        date
    );

    let data;

    (async () => {
      try {
        const ArrayUtil = require("../util/array.js");
        let result = [];
        const trainNo = ["01", "02", "04", "09", "08"];
        for (var i = 0; i < trainNo.length; i++) {
          data = await TrainApi(
            departureLocation,
            departureStation,
            arrivalLocation,
            arrivalStation,
            dateUtil.dateToStr(date),
            trainNo[i]
          );
          ArrayUtil.pushArray(result, data);
        }

        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        console.log(result);
        res.end(apihtml.popup(result));
      } catch (err) {
        console.log(err);
      }
    })();
  });

  router.get("/schedule/save", (req, res) => {
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
  return router;
};

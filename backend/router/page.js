module.exports = app => {
  //함수로 만들어 객체 app을 전달받음
  const express = require("express");
  const fs = require("fs");
  const router = express.Router();
  const expressSession = require("express-session");

  router.get("/", (req, res) => {
    console.log("get(/)요청 실행");

    fs.readFile("./frontend/index.html", (err, data) => {
      if (err) throw err;

      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.end(data);
    });
  });

  router.get("/plan", (req, res) => {
    console.log("get(/plan)요청 실행");

    if (req.session.user) {
      fs.readFile("./frontend/plan.html", (err, data) => {
        if (err) throw err;

        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end(data);
      });
    } else {
      res.redirect("/");
    }
  });

  router.get("/post", (req, res) => {
    console.log("get(/post)요청 실행");

    if (req.session.user) {
      res.render("post/index");
    } else {
      res.redirect("/");
    }
  });
  
  router.get("/myplan", (req, res) => {
    console.log("get(/myplan)요청 실행");

    if (req.session.user) {
<<<<<<< HEAD
      res.render("plan/myplan", (err, data) => {
        if (err) throw err;

        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end(data);
      });
=======
      res.render("plan/myplan");
>>>>>>> 7688531f69e1fc8143b027ce1b87379a80d2f5e6
    } else {
      res.redirect("/");
    }
  });

  return router;
};

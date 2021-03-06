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

  router.get("/posts", (req, res) => {
    console.log("get('/post')실행");

    postModel
      .find({})
      .sort("-createdAt") // 정렬방법 내림차순
      .exec(function(err, posts) {
        if (err) return res.json(err);

        console.log(posts);

        res.render("posts/index", { posts: posts });
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
      res.redirect("/forlogin");
    }
  });

  router.get("/post", (req, res) => {
    console.log("get(/post)요청 실행");

    // if (req.session.user) {
    res.render("post/index"); //게시판 모두 접근 가능한지 궁금합니당.
    // } else {
    //   res.redirect("/forlogin");
    // }
  });

  router.get("/myplan", (req, res) => {
    console.log("get(/myplan)요청 실행");

    if (req.session.user) {
      res.render("plan/myplan", (err, data) => {
        if (err) throw err;

        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end(data);
      });
    } else {
      res.redirect("/forlogin");
    }
  });

  router.get("/forlogin", (req, res) => {
    console.log("get(/forlogin)요청 실행");

    fs.readFile("./frontend/ForLogin.html", (err, data) => {
      if (err) throw err;

      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.end(data);
    });
  });
  return router;
};

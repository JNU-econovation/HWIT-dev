//module
const express = require("express");
const fs = require("fs");

//변수
const app = express();
const port = process.env.PORT || 3000;

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

//error
app.all("*", (req, res) => {
  res.status(404).send("<h1>요청하신 페이지는 없어요.</h1>");
});

//서버 실행
app.listen(port, () => {
  console.log("서버가 실행됨. " + port);
});

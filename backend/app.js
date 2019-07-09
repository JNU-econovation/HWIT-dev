//module
const express = require("express");
const fs = require("fs");

//변수
const app = express();

//설정
app.use(express.static("../frontend"));

//get 요청
app.get("/", (req, res) => {
  console.log("get(/)요청 실행");

  fs.readFile("../frontend/index.html", (err, data) => {
    if (err) throw err;

    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(data);
  });
});

//서버 실행
app.listen(3000, () => {
  console.log("서버가 실행됨.");
});

module.exports = app => {
  var express = require("express");
  var fs = require("fs");
  var router = express.Router();

  router.get("/plan", (req, res) => {
    console.log("get(/process/plan)요청 실행");

    fs.readFile("./frontend/polylineEX.html", (err, data) => {
      if (err) throw err;

      res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
      res.end(data);
    });
  });

  return router;
};

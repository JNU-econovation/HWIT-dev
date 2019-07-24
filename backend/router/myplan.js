module.exports = (app, database) => {
  const mongoose = require("mongoose");
  const express = require("express");
  const router = express.Router();
  const databaseUtil = require("../util/database.js");

  router.get("/", (req, res) => {
    console.log("get(myplan) 요청됨.");

    databaseUtil.getPlans(database, "please@co.kr", (err, result) => {
      if (err) console.log(err);
      //console.log(result);
      try {
        res.render("plan/MyPlans", { plans: result });
      } catch (err) {
        console.log(err);
      }
    });
  });

  router.get("/schedule", (req, res) => {
    console.log("get(myplans/schedule) 요청됨.");
    var title = req.body.title || req.query.title;

    databaseUtil.getSchedule(database, title, (err, result) => {
      if (err) console.log(err);

      try {
        res.render("plan/Schedule", { title: title, schedule: result });
      } catch (err) {
        console.log(err);
      }
    });
  });
  return router;
};

exports.addUser = (db, id, password, repassword, callback) => {
  const mongoose = require("mongoose");
  console.log("addUser 호출됨 : " + id + ", " + password + ", " + password);

  var user = new UserModel({
    _id: mongoose.Types.ObjectId(),
    email: id,
    password: password,
    repassword: repassword
  });

  user.save(err => {
    if (err) {
      callback(err, null);
      return;
    }
    console.log("사용자 데이터 추가함.");
    callback(null, user);
  });
};

exports.authUser = (db, id, password, callback) => {
  console.log("authUser 호출됨: " + id + "," + password);

  UserModel.find({ email: id, password: password }, (err, docs) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (docs.length > 0) {
      console.log("일치하는 사용자를 찾음.");
      callback(null, docs);
    } else {
      console.log("일치하는 사용자를 찾지 못함");
      callback(null, null);
    }
  });
};

exports.addPlan = (db, userEmail, title) => {
  console.log("addPlan 호출됨");

  UserModel.findOne({ email: userEmail }, (err, user) => {
    const plan = new PlanModel({
      title: title
    });

    plan.save(err => {
      if (err) console.log(err);

      user.Plans.push(plan._id);
      user.save();
    });
  });
};

exports.addSchedule = (
  db,
  title,
  depplacename,
  arrplacename,
  depplandtime,
  arrplandtime,
  traingradename
) => {
  console.log("addScheule 호출됨");

  PlanModel.findOne({ title: title }, (err, plan) => {
    const schedule = new ScheduleModel({
      depplacename: depplacename,
      arrplacename: arrplacename,
      depplandtime: depplandtime,
      arrplandtime: arrplandtime,
      traingradename: traingradename
    });

    schedule.save(err => {
      if (err) console.log(err);

      plan.Schedules.push(schedule._id);
      plan.save();
    });
  });
};

exports.getPlans = (database, email, callback) => {
  console.log("getPlans 요청됨");

  UserModel.findOne({ email: email })
    .populate("Plans")
    .exec((err, data) => {
      if (err) callback(err, null);

      callback(null, data.Plans);
    });
};

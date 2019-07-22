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

exports.addSchedule = (
  db,
  userEmail,
  title,
  depplacename,
  arrplacename,
  depplandtime,
  arrplandtime
) => {
  console.log("addScheule 호출됨");

  UserModel.findOne({ email: userEmail }, (err, user) => {
    console.log("user 모델 가져오기");

    user.save(err => {
      console.log("user save 실행");

      if (err) return console.log(err);

      const schedule = new ScheduleModel({
        author: user._id,
        title: title,
        depplacename: depplacename,
        arrplacename: arrplacename,
        depplandtime: depplandtime,
        arrplandtime: arrplandtime
      });
      console.log("schedule 스키마 생성");

      schedule.save(err => {
        if (err) return console.log(err);
      });
    });
  });
};

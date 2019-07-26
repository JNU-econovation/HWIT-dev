exports.defineSchema = () => {
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const UserSchema = Schema({
    email: String,
    password: String,
    repassword: String,
    Plans: [{ type: Schema.Types.ObjectId, ref: "Plan" }]
  });

  const PlanSchema = Schema({
    title: String,
    date: { type: Date, default: Date.now },
    Schedules: [{ type: Schema.Types.ObjectId, ref: "Schedule" }]
  });

  const ScheduleSchema = Schema({
    depplacename: String,
    arrplacename: String,
    depplandtime: String,
    arrplandtime: String,
    traingradename: String
  });
  console.log("Schema 정의함. ");

  var postSchema = Schema(
    {
      title2: { type: String, required: true },
      body: { type: String },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date }
    },
    {
      toObject: { virtuals: true }
      //virtual들을 object에서 보여주는 mongoose스키마 옵션
    }
  );

  console.log("postSchema 정의함. ");

  // postSchema.virtual함수를 이용하여 가상 항목 설정
  postSchema.virtual("createdDate").get(function() {
    return getDate(this.createdAt);
  });

  postSchema.virtual("createdTime").get(function() {
    return getTime(this.createdAt);
  });

  postSchema.virtual("updatedDate").get(function() {
    return getDate(this.updatedAt);
  });

  postSchema.virtual("updatedTime").get(function() {
    return getTime(this.updatedAt);
  });

  // functions
  function getDate(dateObj) {
    if (dateObj instanceof Date)
      return (
        dateObj.getFullYear() +
        "-" +
        get2digits(dateObj.getMonth() + 1) +
        "-" +
        get2digits(dateObj.getDate())
      );
  }

  function getTime(dateObj) {
    if (dateObj instanceof Date)
      return (
        get2digits(dateObj.getHours()) +
        ":" +
        get2digits(dateObj.getMinutes()) +
        ":" +
        get2digits(dateObj.getSeconds())
      );
  }

  function get2digits(num) {
    return ("0" + num).slice(-2);
  }

  ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
  UserModel = mongoose.model("touser", UserSchema);
  PlanModel = mongoose.model("Plan", PlanSchema);
  console.log("Model 정의함. ");
  postModel = mongoose.model("post", postSchema);
  console.log("Model 정의함. ");
};

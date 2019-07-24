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

  ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
  UserModel = mongoose.model("touser", UserSchema);
  PlanModel = mongoose.model("Plan", PlanSchema);
  console.log("Model 정의함. ");
};

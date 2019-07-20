var trainApi = require("./TrainApi.js");

(async () => {
  try {
    data = await TrainApi("서울특별시", "서울", "대전광역시", "대전", "20161001", "00");
    console.log(data);
  } catch (e) {
    console.log(e);

    console.log("Error caught");
  }
})();

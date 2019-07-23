var trainApi = require("../TrainApi.js");

(async () => {
  try {
    var result = [];

    var data = await trainApi("서울특별시", "서울", "대전광역시", "대전", "20161001", "01"); //새마을호
    for (var i = 0; i < data.length; i++) {
      result.push(data[i]);
    }

    data = await trainApi("서울특별시", "서울", "대전광역시", "대전", "20161001", "02"); //무궁화호
    for (var i = 0; i < data.length; i++) {
      result.push(data[i]);
    }
    data = await trainApi("서울특별시", "서울", "대전광역시", "대전", "20161001", "04"); //누리로
    for (var i = 0; i < data.length; i++) {
      result.push(data[i]);
    }
    console.log(result);
  } catch (e) {
    console.log(e);

    console.log("Error caught");
  }
})();

var axios = require("axios");
var fs = require("fs");
const serviceKey =
  "eNBWEX%2Fy7DMugrjlxUjgi1Wf9CXloaGzrtHrVttUe97zs4tZyQjOnN8aErwJ%2FoA7USyzBZA8LpKnjaH%2Fddcb8w%3D%3D";

const trainApi = async (depRegion, depStation, arrRegion, arrStation, time, trainCode) => {
  var depStationCodes = await getStationCode(getCityCode(depRegion));
  var depStationCode = checkTrainCode(depStationCodes.data.response.body.items.item, depStation);

  var arrStationCodes = await getStationCode(getCityCode(arrRegion));
  var arrStationCode = checkTrainCode(arrStationCodes.data.response.body.items.item, arrStation);

  var result = await getSchedule(depStationCode, arrStationCode, time, trainCode);

  var shedule = await parsingData(result);
  return shedule;
};

parsingData = result => {
  return result.data.response.body.items.item;
};

getCityCode = regionName => {
  var data = fs.readFileSync("./backend/api/cityList.json", "utf8");
  var obj = JSON.parse(data);

  for (var i = 0; i < obj.records.length; i++) {
    if (obj.records[i].cityname === regionName) {
      return obj.records[i].citycode;
    }
  }
};

getSchedule = (depPlaceId, arrPlaceId, depPlandTime, trainCode) => {
  const url =
    "http://openapi.tago.go.kr/openapi/service/TrainInfoService/getStrtpntAlocFndTrainInfo";

  const totalUrl =
    url +
    "?" +
    "serviceKey=" +
    serviceKey +
    "&numOfRows=10&pageNo=1" +
    "&depPlaceId=" +
    depPlaceId +
    "&arrPlaceId=" +
    arrPlaceId +
    "&depPlandTime=" +
    depPlandTime +
    "&trainGradeCode=" +
    trainCode;

  try {
    const response = axios.get(totalUrl);
    return response;
  } catch (error) {
    console.error(error);
  }
};

getStationCode = regionCode => {
  const url = "http://openapi.tago.go.kr/openapi/service/TrainInfoService/getCtyAcctoTrainSttnList";
  const totalUrl = url + "?" + "serviceKey=" + serviceKey + "&cityCode=" + regionCode;

  try {
    const response = axios.get(totalUrl);
    return response;
  } catch (error) {
    console.error(error);
  }
};

checkTrainCode = (result, trainName) => {
  for (var i = 0; i < result.length; i++) {
    if (result[i].nodename === trainName) {
      return result[i].nodeid;
    }
  }
};

module.exports = trainApi;

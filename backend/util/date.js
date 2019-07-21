exports.dateToStr = date => {
  //2016-11-30
  var str = date.substring(0, 4);
  str += date.substring(5, 7);
  str += date.substring(8);
  return str; //20161130
};

exports.pushArray = (array, data) => {
  if (data === undefined) {
    return array;
  }

  for (var i = 0; i < data.length; i++) {
    array.push(data[i]);
  }
  return array;
};

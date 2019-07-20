exports.popup = array => {
  let tablerow = "";
  console.log("popup 모듈 실행됨.");
  for (var i = 0; i < array.length; i++) {
    tablerow += '<tr scope="row"><td><input type="checkbox" name="" id=""></td>';
    tablerow += "<td>" + array[i].depplacename + "역</td>";
    tablerow += "<td>" + array[i].arrplacename + "역</td>";
    var tmp = String(array[i].depplandtime).substring(0, 8);
    tablerow +=
      "<td>" +
      tmp.substring(0, 4) +
      " / " +
      tmp.substring(4, 6) +
      " / " +
      tmp.substring(6) +
      "</td>";
    tmp = String(array[i].depplandtime).substring(8, 12);
    tablerow += "<td>" + tmp.substring(0, 2) + " : " + tmp.substring(2) + "</td>";
    tmp = String(array[i].arrplandtime).substring(8, 12);
    tablerow += "<td>" + tmp.substring(0, 2) + " : " + tmp.substring(2) + "</td>";
    tablerow += "</tr>";
  }

  var html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <body>
        <body>
            <table class="table">
              <strong style="font-size:20px">열차시간표 조회</strong>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">출발지</th>
                  <th scope="col">도착지</th>
                  <th scope="col">날짜</th>
                  <th scope="col">열차 출발 시간</th>
                  <th scope="col">열차 도착 시간</th>
                </tr>
              </thead>
              <tbody>
                ${tablerow}
              </tbody>
    </body>
    </html>`;

  return html;
};

exports.popup = array => {
  if (array === undefined) {
    return `<!DOCTYPE html>
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
                  <th scope="col">열차 종류</th>
                </tr>
              </thead>
              <tbody>
                < 조회 된 시간표가 없습니다. >
              </tbody>
              </table>
              <span style="float:right"><button onClick='window.close();' class="btn btn-outline-secondary">닫기</button> </span>
    </body>
    </html>`;
  }
  let tablerow = "";
  console.log("popup 모듈 실행됨.");
  for (var i = 0; i < array.length; i++) {
    tablerow += '<tr scope="row" class = "schedule"><td>' + (i + 1) + "</td>";
    tablerow += `<td class="depplacename">` + array[i].depplacename + "역</td>";
    tablerow += `<td class="arrplacename">` + array[i].arrplacename + "역</td>";
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
    tablerow +=
      `<td class="depplandtime">` + tmp.substring(0, 2) + " : " + tmp.substring(2) + "</td>";
    tmp = String(array[i].arrplandtime).substring(8, 12);
    tablerow +=
      `<td class="arrplandtime">` + tmp.substring(0, 2) + " : " + tmp.substring(2) + "</td>";
    tablerow += `<td class="traingradename">` + array[i].traingradename + "</td>";
    tablerow +=
      `<td><button onClick='submitSchedule(` +
      i +
      `)' class="btn btn-outline-primary">선택</button> </td>`;

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
    
            <table class="table">
              <strong style="font-size:20px">열차시간표 조회</strong>
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">출발지</th>
                  <th scope="col">도착지</th>
                  <th scope="col">날짜</th>
                  <th scope="col">열차 출발 시간</th>
                  <th scope="col">열차 도착 시간</th>
                  <th scope="col">열차 종류</th>
                </tr>
              </thead>
              <tbody>
                ${tablerow}
              </tbody>
              </table>
              <span style="float:right"><button onClick='window.close();' class="btn btn-outline-secondary">닫기</button> </span>
              <span style="float:right"></span>
    <script>
          function submitSchedule(i){
                var data = document.getElementsByClassName("schedule")[i]; //체크박스 객체담기
                var depplacename = data.getElementsByClassName("depplacename")[0].innerHTML;
                var arrplacename = data.getElementsByClassName("arrplacename")[0].innerHTML;
                var depplandtime = data.getElementsByClassName("depplandtime")[0].innerHTML;
                var arrplandtime = data.getElementsByClassName("arrplandtime")[0].innerHTML;
                var traingradename = data.getElementsByClassName("traingradename")[0].innerHTML;

                window.location='/process/schedule/save?depplacename='+depplacename+'&arrplacename='+arrplacename+'&depplandtime='+depplandtime+'&arrplandtime='+arrplandtime+'&traingradename='+traingradename;
           }
    </script>
    </body>
    </html>`;

  return html;
};

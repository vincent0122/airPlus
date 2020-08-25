//credentials.json 숨기기
// 기존 api.js랑 합치기
// redirect 때문에 오류 날 수 있음


const express = require("express");
const asyncify = require("express-asyncify");
const serverless = require("serverless-http");

const app = asyncify(express());
const apiRouter = express.Router();

const logger = require("morgan");
const bodyParser = require("body-parser");

//const Airtable = require("airtable");
//const base = new Airtable({apiKey: process.env.API_KEY}).base('appmdFjy715yHPmNw');
//const base = new Airtable({apiKey: 'keynCOHYwnnoQZDeB'}).base('appmdFjy715yHPmNw');
const getName = require('./getName.js')

app.use(logger("dev", {}));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/.netlify/functions/api", apiRouter);
var today = new Date();
var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();


//구글 백그라운드 끝

//클로저 함수 시작
function setArray(arr) {
  return {
    get_arr: function () {
      return arr;
    },
    set_arr: function (_url) {
      arr.push(_url);
    },
    sort_arr: function () {
      arr.sort();
    },
    ini_arr: function () {
      arr = [];
    },
  };
}

const item = setArray([]);
//클로저 함수 끝

//클로저 함수 시작(for get record Id) **변수로 바꿔야 함**
function setArray2(ids) {
  return {
    get_id: function () {
      return ids;
    },
    set_id: function (_ids) {
      ids = _ids; //왜 var로 선언을 하지 않지?
    },
  };
}


const getRecordId = setArray2([]);

//클로저 함수 끝(for get record Id)
apiRouter.post("/gs_cost_input", (req, res) => {
  const fs = require('fs');
  const readline = require('readline');
  const {
    google
  } = require('googleapis');



  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  const TOKEN_PATH = {
    "access_token": "ya29.a0AfH6SMBm0Gp30-w6aDs5JoSuxheFNkZg4MjwNPj7d2UUH7BN7T8yRQpnGAQG1TYgOXZHDuWZEBTh9q7ZTOo66LoTJWpH2Z87FimBClukzohu1T3D38jN_0uUtyJnupmTO_IGbafS2O8-wwauYxRQsGjCubcgi_OyflI",
    "refresh_token": "1//0erRg5CzdX3qtCgYIARAAGA4SNwF-L9Irqv0CQ1y_4R3xXZUwrBLFajVuM4bO5iy3DMiF140OlYkaaZDy7-kXOrDE8DhkR_L7UJw",
    "scope": "https://www.googleapis.com/auth/spreadsheets",
    "token_type": "Bearer",
    "expiry_date": 1598260908685
};

  //fs.readFile('credentials.json', (err, content) => {
  //  if (err) return console.log('Error loading client secret file:', err);
    authorize(inputCost);
 // });


  function authorize(callback) {
    const {
      client_secret = "WfVO-uCBm5plI1GT7OlB_vE8",
      client_id = "395766971615-uldd4ibgbiqa78kv5dp7qg1huqrpob3u.apps.googleusercontent.com",
      redirect_uris = ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    };
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
      oAuth2Client.setCredentials(TOKEN_PATH);
      callback(oAuth2Client);
    }
  

  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  function inputCost(auth) {
    const sheets = google.sheets({
      version: 'v4',
      auth
    });
    const mySpreadSheetId = '1SXZ9o5ca3B-bsUozboQrFOht8z_oqsX9U_bQTMl9ytQ'
    const sheetName = 'kakaoInput'

    sheets.spreadsheets.values.get({
      spreadsheetId: mySpreadSheetId,
      range: `${sheetName}!C:C`,
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const data = res.data.values;
      let i = data.length;
      console.log(i)

      sheets.spreadsheets.values.update({
        spreadsheetId: mySpreadSheetId,
        range: `${sheetName}!C${i + 1}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          majorDimension: "ROWS",
          values: [
            ["123", "456"]
          ]
        }
      }, (err, result) => {
        if (err) {
          // Handle error
          console.log(err);
        } else {
          console.log('%d cells updated.', result.updatedCells);
        }
      });


    });
  }

  item.ini_arr();
  var buyer = JSON.stringify(req.body.action.detailParams.customer.value);
  var buyer = buyer.replace(/\"/g, "");

  //var info = JSON.stringify(req.body);
  var content = req.body.action.detailParams.contents.origin;

  var writer = JSON.stringify(req.body.userRequest.user.id);
  var wri = writer.replace(/\"/g, "");
  var wri = getName(wri);
  var wri = wri[0].name

  //inputCost(auth, buyer, wri)


  setTimeout(function () {
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [{
          "basicCard": {
            "title": "AIRTABLE 사진추가 하실래요?        한장씩만 가능!!",
            "description": "거래처 :" + buyer,
            "thumbnail": {
              "imageUrl": "https://ifh.cc/g/Bo8Ecb.jpg"
            },
            "buttons": [{
                "action": "block",
                "label": "추가하기",
                "blockId": "5f2f475ef8e71a0001de609b"
              },
              {
                "action": "message",
                "label": "종료하기",
                "messageText": "종료"
              }
            ]
          }
        }, ],
      },
    };


    res.status(200).send(responseBody);
  }, 500);

});

module.exports.handler = serverless(app);

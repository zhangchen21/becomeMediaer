// 引入 request 模块，用于发送 HTTP 请求
const request = require('request');
const fs = require("fs");

const NoQuestionStr = `你似乎来到了没有知识存在的荒原`;
const MoneyStr = `"questionType":"commercial"`;
const WarnStr = `系统监测到您的`;

// 定义目标网址
const url = 'https://www.zhihu.com/hot';
let currentVaildQuestionNumber = '';
let currentQuestionNumber = currentVaildQuestionNumber;
let failCount = 0;
let warnCount = 0;
// let isRunning = true;
// let skippedQuestionNumbers = [];

requestURL();

function requestURL() {
  const URL = url + currentQuestionNumber;
  setTimeout(() => {
    request.get(URL, (error, response, body) => {
      // 如果有错误，打印错误信息
      if (error) {
        errorLog(error);

        // Try after 2 seconds
        setTimeout(requestURL, 2000);
        return;
      }

      // if (body.includes(WarnStr)) {
      //   log(`Warning! Will wait`);
      //   warnCount++;

      //   // Try after sometimes
      //   setTimeout(requestURL, 1000 * (Math.random() * 30 * warnCount + 10 + Math.random() * warnCount));
      //   return;
      // }

      // // Decrease warn count but not less than 0
      // warnCount > 0 && warnCount--;

      // // No question
      // if(body.includes(NoQuestionStr)) {
      //   log(`Request ${URL} has no question`);
      //   failCount ++;

      //   if(failCount > 200) {
      //     // There is no new question currently, reset
      //     currentQuestionNumber = currentVaildQuestionNumber;

      //     // Try after 10 minutes
      //     currentQuestionNumber += 3;
      //     setTimeout(() => {
      //       isRunning = true;
      //       requestURL();
      //     }, 1000 * 60 * 10);

      //     // // Try skipped questions
      //     // log("Start Trying Skipped Question Numbers!");
      //     // isRunning = false;
      //     // handleSkippedQuestions();

      //     return;
      //   }

      //   currentQuestionNumber += 3;
      //   requestURL();
      //   return;
      // }

      // if(body.includes(MoneyStr)) {
      //   // Add URL
      //   fs.appendFileSync("src/Pages/Zhihu/moneyURLs.txt", URL + "\n");
      // }

      
      fs.writeFile(
        `src/Pages/Zhihu/hot.html`, 
        body, 
        (err) => {
          if (err) return;
      })

      log(`Request ${URL} successfully`);
      failCount = 0;
      currentVaildQuestionNumber = currentQuestionNumber;
      // Barely a success follow a success
      // skippedQuestionNumbers.push(currentQuestionNumber + 1);
      currentQuestionNumber += 3;
      // requestURL();
    })  
  }, 500)
}

function errorLog(log) {
  fs.appendFile(
    "src/logs/error.log", 
    log + "\n", 
    (err) => {
      if (err) return;
  })
}

function log(log) {
  const time = new Date();

  fs.appendFile(
    `src/logs/log_${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}.log`, 
    log + "\n", 
    (err) => {
      if (err) return;
  })
}

// function handleSkippedQuestions() {
//   setTimeout(() => {
//     if(skippedQuestionNumbers.length === 0) {
//       log("Have Finished Skipped Question Numbers!");
//       return;
//     }
//     request.get(url + skippedQuestionNumbers.shift(), (error, response, body) => {
//       if(body.includes(MoneyStr)) {
//         // Add URL
//         fs.appendFileSync("src/Pages/Zhihu/moneyURLs.txt", url + number + "\n");
//       }
//     });

//     !isRunning && handleSkippedQuestions();
//   }, 500)
// }

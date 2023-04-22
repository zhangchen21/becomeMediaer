// 引入 request 模块，用于发送 HTTP 请求
const request = require('request');
const fs = require("fs");

// 定义目标网址
const url = 'https://www.zhihu.com/hot';

// 发送 GET 请求
request.get(url, (error, response, body) => {
  // 如果有错误，打印错误信息
  if (error) {
    console.error(error);
  } else {
    // 如果请求成功，打印响应状态码和网页内容
    console.log('Status code:', response.statusCode);
    // console.log('Body:', body);
    fs.writeFile("src/Pages/Zhihu/hot.html", body, (error) => {
      if(error) {
        console.log(error);
        return;
      }
      console.log("File has been saved!");
    })
  }
});
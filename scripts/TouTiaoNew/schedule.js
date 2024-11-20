const { execFile } = require('child_process');  
const moment = require('moment'); 

// !!!!启动前准备，打开KeymouseGo_v5_1_1-win，并打开浏览器，tab页依次为 LoaclHost、头条首页

const minute = 1000 * 60;
const time = minute * 60; // 设置定时任务
const targetTimes = [7, 8, 12, 18, 19, 21]

// 分功能
const tasks = [
  './scripts/start1.txt', 
  './scripts/set_cars.txt', 
  './scripts/publish.txt',
  './scripts/backToDesk.txt',

  './scripts/start2.txt', 
  './scripts/set_health.txt', 
  './scripts/publish.txt',
  './scripts/backToDesk.txt',
]

// 记录当前执行的脚本的索引
let index = 0;

// 开始
start();
setInterval(() => {
  if(targetTimes.includes(moment().hour())) {
    start();
  }
}, time)

function start() {
  if(index >= tasks.length) {
    index = 0;
    return;
  }
  // 执行当前脚本
  job(tasks[index]);
  index ++;
}

function job (args) {
    const executablePath = './KeymouseGo_v5_1_1-win.exe'; // 按键精灵程序 
    
    execFile(executablePath, [args], (error, stdout, stderr) => {  
      if (error || stderr) {  
        console.error(`【exec error】: ${new Date()} ${error || stderr}`);  
        return;  
      }  
     console.log(`【Done】: ${new Date()} - ${args}`); 

     // 执行下一个
     start();
    }); 
}
  
console.log(`Task scheduled to run.`);
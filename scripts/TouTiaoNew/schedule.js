const { execFile } = require('child_process');  
const moment = require('moment'); 

// !!!!启动前准备，打开KeymouseGo_v5_1_1-win，并打开浏览器，tab页依次为 LoaclHost、头条首页

const minute = 1000 * 60;
const time = minute * 60 * 3; // 设置定时任务，每隔10mins执行一次
// 要执行的时间点（小时）  
// const targetHours = [7, 9, 11, 15, 18, 21];  
  
// 前后随机 30 分钟的范围（分钟）  
// const timeWindowMinutes = 30;  


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
  start();
}, time)

// 检查并执行任务  
// function checkAndExecuteTask() {  
//   const now = moment();   
  
//   for (const hour of targetHours) {  
//     const targetTime = moment().hour(hour).minute(30).second(0);  
  
//     // 计算前后 30 分钟的时间范围  
//     const windowStartTime = targetTime.clone().subtract(timeWindowMinutes, 'minutes');  
//     const windowEndTime = targetTime.clone().add(timeWindowMinutes, 'minutes');  
  
//     if (now.isBetween(windowStartTime, windowEndTime, null, '[]')) {  
//       start();  
//       // 避免同个时间内多次执行
//       setTimeout(() => {
//         checkAndExecuteTask()
//       , Math.floor(60 * minute)})  
//       return; // 只执行一次  
//     }  
//   }  
  
//   setTimeout(() => {
//     checkAndExecuteTask()
//   , Math.floor((Math.random(30) + 30) * minute)})  
// }  

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
  
// checkAndExecuteTask();
console.log(`Task scheduled to run.`);
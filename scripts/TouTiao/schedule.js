const schedule = require('node-schedule');  
const { execFile } = require('child_process');  

// !!!!启动前准备，打开KeymouseGo_v5_1_1-win，并打开浏览器，tab页依次为 LoaclHost、百度图片、文心一言和头条首页

const minute = 1000 * 60;
const time = minute * 15; // 设置定时任务，每隔10mins执行一次

// const task = 'scripts/0807_2154.txt'; // 以及 'scripts/newTalk.txt' ，发文和重置的脚本， kimi，暂时不用了

// 分功能
const tasks = [
  'scripts/start1.txt', 
  'scripts/newArticle2Title.txt', 
  'scripts/getImage.txt',
  'scripts/getContent.txt',
  'scripts/publish.txt',
  'scripts/resetGptConversition.txt',
  'scripts/deleteOldTab.txt',
  'scripts/backToDesk.txt',

  // 
  'scripts/start2.txt', 
  'scripts/newArticle2Title.txt', 
  'scripts/getImage.txt',
  'scripts/getContent.txt',
  'scripts/publish.txt',
  'scripts/resetGptConversition.txt',
  'scripts/deleteOldTab.txt',
  'scripts/backToDesk.txt',

]

// 记录当前执行的脚本的索引
let index = 0;

// 开始
start();
setInterval(() => {
  start();
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
     console.log(`【Done】: ${new Date()}`); 

     // 执行下一个
     start();
    }); 
}
  
console.log(`Task scheduled to run.`);
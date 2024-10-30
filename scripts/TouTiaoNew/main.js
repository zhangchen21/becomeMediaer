const { spawn } = require('child_process');

// 定义要执行的命令和目录
const preTasks = [
  {
    cmd: 'npm',
    args: ['run', 'dev'],
    cwd: '../../front'
  },
  {
    cmd: 'node',
    args: ['server.js'],
    cwd: '../../backend/src/TouTiaoNew'
  },

];

const jobTasks = [
  {
    cmd: 'node',
    args: ['schedule.js'],
    cwd: './'
  }
]

// 启动任务的函数
function startTask(task) {
  return new Promise((resolve, reject) => {
    const { cmd, args, cwd } = task;
    console.log(`正在 ${cwd} 目录下启动: ${cmd} ${args.join(' ')}`);
    const child = spawn(cmd, args, { cwd, shell: true });

    child.stdout.on('data', (data) => {
      console.log(`stdout (${cwd}): ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr (${cwd}): ${data}`);
    });

    child.on('close', (code) => {
      console.log(`进程在目录 ${cwd} 退出，退出码 ${code}`);
      resolve();
    });

    child.on('error', (error) => {
      console.error(`启动进程出错: ${error}`);
      reject(error);
    });
  });
}

// 并行启动所有任务
Promise.all(preTasks.map(startTask))
  .catch((error) => {
    console.error('启动进程时发生错误:', error);
  });

setTimeout(() => {
  Promise.all(jobTasks.map(startTask))
  .catch((error) => {
    console.error('启动进程时发生错误:', error);
  });
}, 5000)

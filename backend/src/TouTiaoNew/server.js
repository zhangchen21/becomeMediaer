// nodemon 启动
import path from 'path';  
import { fileURLToPath } from 'url';  
import express from 'express';  
import fs from 'fs/promises';  
import { convertToHtml, extractRawText } from 'mammoth';  
import { default as randomItem } from 'random-item'; // 假设 random-item 支持 ESM，或者你可能需要找到一个替代库  
import cors from 'cors'; 
import { getTitle } from './api/api.js';

const FLAG = "。。"; // 以此作为文章分割符号
const prifix = '<b>大家好，我是晨说。爱财，财就会爱你！->>点击关注<<-，每天带你学习赚钱思维，分享最新财经动向！</b><br /><br />'

// 获取当前模块的 URL 并转换为文件路径  
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块文件所在的目录路径  
const __dirname = path.dirname(__filename);
const app = express();  
const port = 3000;  
// 允许来自任何域的请求（注意：在生产环境中不要这样做，出于安全考虑）  
app.use(cors());
  
app.get('/random-docx', async (req, res) => {  
  const targetDir = req.query.target;  
  try {  
    // 指定 docx 文件的目录  
    const directoryPath = path.join(__dirname, 'contents/' + targetDir);  
  
    // 读取目录内容  
    const files = await fs.readdir(directoryPath, { withFileTypes: true });  
      
    // 过滤出 .docx 文件  
    const docxFiles = files.filter(file => file.isFile() && file.name.endsWith('.docx')).map(file => file.name);  
      
    // 如果没有 .docx 文件，返回错误  
    if (docxFiles.length === 0) {  
      return res.status(404).json({ code: 1, message: 'No .docx files found' });  
    }  
      
    // 随机选择 n (2 <= n <= 3) 个 .docx 文件  
    // const random = Math.ceil(Math.random() * 2 + 1);
    const random = 2;
    const randomFiles = docxFiles.map(_ => randomItem(docxFiles)).slice(0, random);
    const filePaths = randomFiles.map(file => path.join(directoryPath, file));

    console.log(`【读取文件】 读取 ${filePaths.join("; ")}`)
      
    let title = '';  
    let content = targetDir === 'media' ? prifix : '';  // 带上前缀
    for (const filePath of filePaths) {  
      try {  
        // 从第 1 个随机的文件内容中使用 AI 生成标题
        if (filePaths.indexOf(filePath) === 0) {  
          const text = await extractRawText({ path: filePath });
          title = await getTitle(text.value);  
        }  

        const html = await convertToHtml({ path: filePath });
        // 拼接内容，由于以上都是随机过程，因此这一步检查下是否有重复内容，有的话不进行拼接
        const newContent = randomItem(html.value.split(FLAG));
        if(!content.includes(newContent)) {
          content += '<br />';  // 换行
          content += newContent;  
        }
      } catch (error) {  
        console.error(`【文件解析错误】 解析 ${filePath} 中出现：`, error);  
      }
    }  

    // 设置响应数据  
    const responseData = { code: 0, data: { title, content } };  
    res.json(responseData);  
  } catch (error) {   
    console.error('【服务端错误】 ', error);  
    res.status(500).json({ code: 2, message: '服务端错误' });  
  }  
});
  
// 启动服务器  
app.listen(port, () => {  
  console.log(`Server is running at http://localhost:${port}`);  
});
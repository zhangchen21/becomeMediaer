// nodemon 启动
import path from 'path';  
import { fileURLToPath } from 'url';  
import express from 'express';  
import fs from 'fs/promises';  
import { convertToHtml } from 'mammoth';  
import { default as randomItem } from 'random-item'; // 假设 random-item 支持 ESM，或者你可能需要找到一个替代库  
import cors from 'cors'; 
import { getTitle } from './api/api.js';

const FLAG = "。。"; // 以此作为文章分割符号

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
      
    // 注意：由于 import.meta.url 返回的是一个 URL 形式的路径，我们需要将其转换为文件系统路径  
    // 这里使用 replace('file://', '') 是为了从 URL 中移除 'file://' 前缀，并添加 '..' 来回到父目录（因为 import.meta.url 指向当前文件的位置）  
    // 根据你的项目结构，你可能需要调整这个路径  
  
    // 读取目录内容  
    const files = await fs.readdir(directoryPath, { withFileTypes: true });  
      
    // 过滤出 .docx 文件  
    const docxFiles = files.filter(file => file.isFile() && file.name.endsWith('.docx')).map(file => file.name);  
      
    // 如果没有 .docx 文件，返回错误  
    if (docxFiles.length === 0) {  
      return res.status(404).json({ code: 1, message: 'No .docx files found' });  
    }  
      
    // 随机选择一个 .docx 文件  
    const randomFile1 = randomItem(docxFiles);
    const randomFile2 = randomItem(docxFiles.filter(file => file !== randomFile1));

    const filePath1 = path.join(directoryPath, randomFile1);  
    const filePath2 = path.join(directoryPath, randomFile2);  
      
    // 读取文件内容  
    const fileBuffer1 = await fs.readFile(filePath1);  
    const fileBuffer2 = await fs.readFile(filePath2);  
      
    // 使用 Mammoth.js 将 docx 转换为 HTML  
    const result1 = await convertToHtml(fileBuffer1);  
    const result2 = await convertToHtml(fileBuffer2);  
      
    // 提取 HTML 内容  
    const content1 = result1.value.split(FLAG)[0]; // 取前半段
    const content2 = result2.value.split(FLAG)[1]; // 取后半段

    // 设置标题
    const title = await getTitle(randomFile1.replace('.docx', '')); // 从文件名中提取标题（去掉 .docx 后缀），拼接文章的标题取作为前半段的文章的标题

    // 设置响应数据  
    const responseData = { code: 0, data: { title, content: content1 + content2 } };  
      
    // 发送响应  
    res.json(responseData);  
  } catch (error) {  
    // 处理错误并发送错误响应  
    console.error('Error reading or converting file:', error);  
    res.status(500).json({ code: 2, message: 'Error reading or converting file' });  
  }  
});
  
// 启动服务器  
app.listen(port, () => {  
  console.log(`Server is running at http://localhost:${port}`);  
});
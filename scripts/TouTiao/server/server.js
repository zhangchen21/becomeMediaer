const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = 3000;
// 允许所有域名访问
app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // 允许的源，可以设置为你的前端应用的地址
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // 允许携带凭证
}));

// 路由以获取新闻
app.get('/getNews', async (req, res) => {
  try {
    const response = await axios.get('https://news.sina.com.cn/');
    const html = response.data;
    const $ = cheerio.load(html);
    let newsTitles = [];

    let promises = [];

    // 查找所有class为blk_09的标签下的a标签，并提取innerText
    // $('*').each((index, element) => {
    $('div.blk_main_li').each((index, element) => {
      if(index === 0) { // 第一个是热榜
        $(element).find('a').each((i, a) => {
          const news = $(a).text().trim();
          // 包含 | 的都是些广告，超过25字的可能是采访内容
          // if(news.length > 15 && news.length < 25 && news.indexOf("｜") === -1 && news.indexOf("【") === -1 && news.indexOf("com") === -1 && news.indexOf("|") === -1  && news.indexOf("\n") === -1) {
          if(news.indexOf("｜") === -1 && news.indexOf("【") === -1 && news.indexOf("com") === -1 && news.indexOf("|") === -1  && news.indexOf("\n") === -1) {
            newsTitles.push({
              text: news
            })
  
            promises.push(axios.get('https://image.baidu.com/search/index?tn=baiduimage&fm=result&ie=utf-8&word=' + news))
          }
        });
      }

    });

    // 使用Promise.all等待所有请求完成
    Promise.all(promises)
      .then(results => {
        return results; // 这里可以根据需要返回任何数据
      })
      .then(processedResults => {
        processedResults.forEach((res, index) => {
          const $ = cheerio.load(res);
          const src = $('[class^="main_img"]').eq(1)?.attr('src'); // 记录第二张图片的src

          newsTitles[index].img = src;
        })

        // 将新闻标题数组发送回客户端
        const randomNum = Math.floor(Math.random() * (newsTitles.length - 6));
        res.json(newsTitles.slice(randomNum, randomNum + 15));
      })

    // newsTitles = [...new Set(newsTitles)];
    // res.json(newsTitles.filter(title => title.length > 10));
  } catch (error) {
    console.error('请求或解析错误:', error);
    res.status(500).send('服务器内部错误');
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
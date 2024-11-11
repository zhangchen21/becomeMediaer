import { JSDOM } from 'jsdom';
import { getAI } from '../api/api.js';
import axios from 'axios';
import { default as randomItem } from 'random-item'; 

export async function getNews () {
  try {
    const links = (await getHtmlBody('https://finance.sina.com.cn/')).querySelectorAll('div.m-hdline a');
    
    // 随机选一个新闻
    const link = randomItem([...links]);

    const newTitle = link.textContent.trim();

    // 获取新闻内容
    const newsLink = link.href;
    console.log(`【读取新闻】 读取 ${newsLink}`)

    let newContent;
    const document = await getHtmlBody(newsLink);
    const article = document.querySelector('div.article');

    // 找到第 2 个 .img_wrapper 元素
    const SecondImgWrapper = article.querySelectorAll('.img_wrapper')[1];

    const shouldSkip = [
      article.querySelector('style'),
      article.querySelector('blockquote'),
      article.querySelector('.hqimg_related'),
    ]

    const shouldBreak = [
      article.querySelector('script'),
      article.querySelector('#app-kaihu-stock'),
      article.querySelector('.appendQr_wrap'),
      article.querySelector('.app-kaihu-qr'),
    ]

    // 创建一个 div 来存储 .img_wrapper 之前的内容
    const div = document.createElement('div');
    
    // 遍历 .article 的子节点，直到找到 .img_wrapper
    let currentNode = article.firstChild;
    while (currentNode) {
      // 保存下一个节点，因为 appendChild 会改变 currentNode 的兄弟节点顺序
      const nextNode = currentNode.nextSibling;

      if (shouldSkip.includes(currentNode)) {
        currentNode = nextNode;
        continue;
      }
      if (shouldBreak.includes(currentNode)) {
        break;
      }

      // 将当前节点移动到 div 中
      div.appendChild(currentNode);

      // 只保留到第一个 img 的内容
      if (currentNode === SecondImgWrapper) {
        break;
      }

      // 移动到下一个兄弟节点
      currentNode = nextNode;
    }
      
    // AI 处理 div 内容，对随机 n 个 p 标签内容进行修改
    const ps = [...div.querySelectorAll('p')];
    let shouldAI = [];
    // n 取随机数，不超过数量的 80%
    let randomCount_p = Math.min(Math.floor(Math.random() * ps.length) + 1, Math.floor(ps.length * 0.8));
    console.log("【改写句子数量】", randomCount_p)
    while(randomCount_p >= 0) {
      shouldAI.push(randomItem(ps));
      randomCount_p --;
    }
    
    const AIPromises = [];
    shouldAI.forEach((p, index) => {
      const innerText = p.textContent;

      const promise = new Promise(async (resolve) => {
        // console.log("改写前：", innerText)
        const newText = await getAI(`请用改变描述方式、用词、句式、适当的删除和增加内容等方式，大幅度改写以下内容："${innerText}"。（要求：返回内容的格式为：纯净的内容字符串）`);
        // console.log("改写后：", newText)
        p.innerHTML = newText;
        resolve();
      })

      AIPromises.push(promise);
    })
    await Promise.all(AIPromises);

    // 此时 div 包含了 .img_wrapper 之前的所有内容
    newContent = div.outerHTML.trim();

    const res = `<b>【财经前沿】</b><br /><b>${newTitle}</b><br />${newContent}<br /><b>【赚钱思维】</b>`;
    return { title: newTitle, text: res};
  } catch (error) {
    console.error('获取新闻错误:', error?.message);
  }
}

async function getHtmlBody(url) {
  let document;

  try {
    const response = await axios.get(url);
    const html = response.data;
    // 创建一个JSDOM实例
    const dom = new JSDOM(html, { omitJSDOMErrors: true });
    
    // 获取document对象，它类似于在浏览器中的window.document
   document = dom.window.document;
  } catch(error) {
    console.error("【请求新闻出错】", error?.message)
  }

  return document;
}
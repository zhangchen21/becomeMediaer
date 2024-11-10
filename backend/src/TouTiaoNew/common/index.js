import { JSDOM } from 'jsdom';
import { getAI } from '../api/api.js';
import axios from 'axios';
import { default as randomItem } from 'random-item'; // 假设 random-item 支持 ESM，或者你可能需要找到一个替代库 

export async function getNews () {
  try {
    // 使用querySelectorAll来选择所有class为blk_main_li的div下的a标签
    const links = (await getHtmlBody('https://finance.sina.com.cn/')).querySelectorAll('div.m-hdline a');
    
    // 随机选一个新闻
    const link = randomItem([...links]);

    const newTitle = link.textContent.trim();

    // 获取新闻内容
    const newsLink = link.href;
    let newContent;
    const document = await getHtmlBody(newsLink);
    const article = document.querySelector('div.article');
    // 找到第一个 .img_wrapper 元素
    const firstImgWrapper = article.querySelector('.img_wrapper');
    
    if (firstImgWrapper) {
      // 创建一个 div 来存储 .img_wrapper 之前的内容
      const div = document.createElement('div');
      
      // 遍历 .article 的子节点，直到找到 .img_wrapper
      let currentNode = article.firstChild;
      while (currentNode) {
         // 保存下一个节点，因为 appendChild 会改变 currentNode 的兄弟节点顺序
        const nextNode = currentNode.nextSibling;
        // 将当前节点移动到 div 中
        div.appendChild(currentNode);

        if(currentNode === firstImgWrapper) {
          break;
        }

        // 移动到下一个兄弟节点
        currentNode = nextNode;
      }
      
      // 此时 div 包含了 .img_wrapper 之前的所有内容
      newContent = div.outerHTML.trim();
    } else {
      // 如果没有找到 .img_wrapper，则处理整个 .article 的内容
      newContent = article.outerHTML.trim();
    }
    
    // 过滤掉包含特定字符的新闻标题
    // if (news.indexOf('｜') === -1 && news.indexOf('【') === -1 && news.indexOf('com') === -1 && news.indexOf('|') === -1 && news.indexOf('\n') === -1) {
    //   newsTitle = news[0];
    // }

    // const newsContent = await getAI(`请你搜索并阅读下面的链接（链接https://www.baidu.com/s?ie=UTF-8&wd=${newsTitle}），并基于其中的文字内容写一篇文章。
    // 重要！：!!确保你的回答只要文章内容，不需要标题，不要带前缀和后缀，内容不超过200字`);

    const res = `<b>【财经前沿】${newTitle}</b><br />${newContent}<br />`;
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
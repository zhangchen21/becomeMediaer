export async function getData(target: string) {			
  const res = await(await fetch('http://localhost:3000/random-docx?target=' + target)).json();
  if(res?.code === 0) {
    return res.data;
  }
  return {}
}

export async function testAI() {
  // 请求参数
  const model = 'glm-4-plus'; // 替换为您的模型编码  
  const messages = [  
    { role: "user", content: `请你搜索并阅读下面的链接（链接https://www.baidu.com/s?ie=UTF-8&wd=${"两个月大涨40%！比特币，刷新历史新高！近9万人爆仓"}），并基于其中的文字内容写一篇文章。
    重要！：!!确保你的回答只要文章内容，不需要标题，不要带前缀和后缀，内容不超过300字` }  
  ];  

  const api_key = '823259dac055de1e7eb23f2d99befbb5.SkOxW64tEPLNjhNI'; // 替换为您的唯一请求标识符，或省略以使用默认生成的  
  const headers = {  
    'Content-Type': 'application/json;charset=UTF-8',   
    Authorization: api_key  
  };  
    
  // 构建请求体
  const requestBody = {  
    model: model,  
    messages: messages,  
    api_key: api_key, 
    temperature: 0.9
  };
  const res = await(await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {  
    method: 'POST',  
    headers,  
    body: JSON.stringify(requestBody)  
  })).json();

  return res.choices[0].message.content?.replaceAll("\"", "");
}
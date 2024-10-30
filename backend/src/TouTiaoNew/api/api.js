export async function getTitle(text) {
  // 请求参数
  const model = 'glm-4'; // 替换为您的模型编码  
  const messages = [  
    { role: "user", content: `请将这个标题进行一些修饰性的改动，不改变原有意思：${text}` }  
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
    temperature: 0.6
  };
  const res = await(await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {  
    method: 'POST',  
    headers,  
    body: JSON.stringify(requestBody)  
  })).json();

  return res.choices[0].message.content?.replaceAll("\"", "");
}
export async function getTitle(text) {
  // 请求参数
  const model = 'glm-4-plus'; // 替换为您的模型编码  
  const messages = [  
    { role: "user", content: `请模仿下述标题：
      “你一定要知道的...医生都不愿意曝光的内幕消息！”，
      “作为一名普通职员，我是如何完成蜕变取得成功的！”，
      “坚持早起 60 天后，我收获的不只是健康！！”，
      “重要：再不做这件事就晚了！家有 10-17 岁孩子的需注意这一点”，
      “女人应该这样穿内衣，舒服到不想脱”，
      “内心强大的人到底是什么样？看她才知道”，
      “微信搜索 3 个字，暴露了谁在偷偷爱你”，
      “我，一个教了 8 年学的中学地理老师，强烈推荐每个人都看看它”，
      “讨厌一个人，用不着翻脸”，
      “人贪三样，一生白忙”，
      “低层次的人，总爱做这四件事”，
      “一个人情商很高的几种迹象”。
      将这个标题改动成网络爆款文案，不改变原有意思：
      ————————————————————
      ${text}
      ————————————————————
      要求：1、返回内容的汉字和符号加起来不超过30个，且返回格式为：纯净的标题内容字符串
      ` }  
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
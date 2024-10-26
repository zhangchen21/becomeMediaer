// import API_KEY from './Secret_donot_push';

export const getDataFromGpt = async (prompt: string, max_tokens: number, temperature: number): Promise<string> => {
	console.log(prompt);
	const url = "https://api.openai.com/v1/completions";
	const model = "text-davinci-003";

	const requestOptions = {
		method: "POST",
		headers: {
			"content-Type": "application/json",
			// API_KEY
      Authorization: "Bearer " + "",
		},
		body: JSON.stringify({
			prompt,
			temperature,
			max_tokens,
			model: model,
		}),
	};

	const response = await fetch(url, requestOptions);
	const data = await response.json();
	return data?.choices[0].text;
}
export function findDistinctCommonSubstring(str1: string, str2: string) {
    const distinctCommonSubstring = [];
    const str1Length = str1.length;
    const str2Length = str2.length;
  
    for (let i = 0; i < str1Length; i++) {
      for (let j = 0; j < str2Length; j++) {
        let k = 0;
        while (i + k < str1Length &&
               j + k < str2Length &&
               str1[i + k] === str2[j + k] &&
               k < 5) { // 添加判断条件，限制相同部分长度最小为5
          k++;
        }
        if (k >= 5) { // 修改条件，只将长度大于等于5的相同部分添加到结果数组
          distinctCommonSubstring.push(str1.substring(i, i + k));
        }
      }
    }
  
    return distinctCommonSubstring;
}

export function searchArrayInString(arr: string[], str: string) {
  console.log(arr)
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const product = arr[i].replace("知乎知物", "").replace("知乎出品", "").trim().split(" ");
      str.includes(product[0]) && result.push(product[0]);
    }
    return [...new Set(result)];
}
  
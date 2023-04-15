const addProductionBtn = 
    Array.from(document.querySelectorAll("button"))
    .find(el => 
        el.getAttribute("aria-label") == "收益"
    );
addProductionBtn.click();


const productsBtn = 
    Array.from(document.querySelectorAll("div"))
    .find(el => 
        el.innerText == "知乎商品"
    );
productsBtn.click();

const product = document.querySelector(".MCNGoodSearch-goodList").firstChild;

const productInfo = product.querySelector("a").innerText;

const addBtn = Array.from(product.querySelectorAll("button")).find(el => el.innerText == "添加").click();

// 确认添加商品
Array.from(document.querySelectorAll("button")).find(el => el.innerText == "确定").click();


let answerText;

const getDataFromGpt = (info) => {
    const url = "https://api.openai.com/v1/completions";
    const prompt = `请帮我写一篇三百字的文章，从功能、外观和使用体验等方面推荐这款产品：${info}`;
    const temperature = 0.5;
    const maxTokens = 512;
    const model = "text-davinci-003";

    const requestOptions = {
        method: "POST",
        headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${API_Key}`,
        },
        body: JSON.stringify({
            prompt: prompt,
            temperature: temperature,
            max_tokens: maxTokens,
            model: model,
        }),
    };

    fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
        appendAnswer(data?.choices[0].text);
    })
    .catch((error) => console.log(error));
}

function appendAnswer(answer) {
    let answer = document.createElement("span");
    answer["data-text"] = true;
    answer.innerText = "Dasdasd";

    Array.from(document.querySelectorAll("span"))
    .find(el => 
        el.getAttribute("data-offset-key") == "57emp-0-0"
    )
    .appendChild(answer);
}

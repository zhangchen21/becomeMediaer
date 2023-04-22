function publishAnswer() {
    let productName = "";

    const click = (element, callback) => {
        element.click();
        setTimeout(() => {
            callback()
        }, 3000)
    }
    
    // Write answer
    click(document.getElementsByClassName("Button FEfUrdfMIKpQDJDqkjte Button--blue JmYzaky7MEPMFcJDLNMG")[4], appendAnswer);
    
    function clickWallet() {
        const addProductionBtn = 
            Array.from(document.querySelectorAll("button"))
            .find(el => 
                el.getAttribute("aria-label") == "收益"
            );
    
        click(addProductionBtn, chooseProduct);    
    }
    
    function chooseProduct() {
        const selectInput = Array.from(document.querySelectorAll("input"))[0];
        setTimeout(() => {
            navigator.clipboard.readText()
            .then(text => {
                selectInput.value = text;
            })
            setTimeout(addProduct, 3000)
        }, 1000);
    }
    
    function addProduct() {
        const product = document.querySelector(".MCNGoodSearch-goodList").firstChild;
    
        const addBtn = Array.from(product.querySelectorAll("button")).find(el => el.innerText == "添加")
        
        click(addBtn, add);    
    }
    
    // 确认添加商品
    function add() {
        Array.from(document.querySelectorAll("button")).find(el => el.innerText == "确定").click();   
    }
    
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
    
    function appendAnswer() {
        let answer = document.createElement("span");
        answer["data-text"] = true;
    
        setTimeout(() => {
            navigator.clipboard.readText()
            .then(text => {
                answer.innerText = text;
            })
    
            Array.from(document.querySelectorAll("span"))
            .find(el => el.getAttribute("data-offset-key"))
            .appendChild(answer);
    
            setTimeout(clickWallet, 2000);
                    
        }, 3000);
    }
}

import { Promote } from "../Promotes/promote";

const WriteURL = "https://www.zhihu.com/creator/mcn";

const updateProducts = () => {
	return (`
	const Products = {

	};

	const selectBtn = document.getElementsByClassName("Button InputLike InputButton Select-button MCNGoodSearchCategorySelect-selectButton")[0];
	selectBtn.click();

	async function copyToClipboard(text) { 
		try { 
			await navigator.clipboard.writeText(text);
		} catch (err) { 
			console.error("Failed to copy: ", err); 
		} 
	}

	function clickAndRedraw(elements) {
		let i = 0;
		function clickNext() {
			if (i >= elements.length) {
				copyToClipboard(JSON.stringify(Products));
				console.log("已复制到剪贴板！");
				return;
			}

			const selectBtn = document.getElementsByClassName("Button InputLike InputButton Select-button MCNGoodSearchCategorySelect-selectButton")[0];
			selectBtn.click();

			const typeBtns = Array.from(document.querySelectorAll(".Select-option"));
			typeBtns[i].click();

			setTimeout(() => {
				getProducts();
				i ++;
				clickNext();
			}, 2000);
		}

		function getProducts() {
			// Get products in this type
			const products = Array.from(
				document.querySelectorAll(".css-a68l8f")
			).map(el => el.innerText);

			Products[typeBtns[i].innerText] = products;
		}

		clickNext();
	}

	const typeBtns = Array.from(document.querySelectorAll(".Select-option"));
	clickAndRedraw(typeBtns);
	`)
};

const chatType = (question: string, types: string[]) => 
	`你是一位百货公司的老板，有位顾客在网上提出了这个问题：“${question}”，你手上拥有的货物有以下几个种类：'${types.join("'，'")}'，你只能从中选择一个种类向他推销货物，请选择和该问题相关度最高的一种，你会选择哪个呢？请在回答时仅仅告诉我你会选择哪个种类，不需要其他任何文字和标点符号。`

const chatQuestion = (products: string[], question: string, type: string) => `
	请你写一篇文章（注意：文章中不能使用“首先”，“其次”等连接词）去回答这个问题：'${question}'，你的文章内容要严格按照以下的"${Promote[type]}"，并从以下产品选择和问题较为相关的几个产品向他推荐，每个产品写三百字左右。产品名单如下：'${products.join(',')}'`

function publishAnswer(answerText: string, selectedProduct: string) {
	return (`
	const selectedProduct = \`${selectedProduct}\`;
	const answerText = \`${answerText}\`;
	let dropIframeDocument;
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
		dropIframeDocument = document.getElementsByClassName("UserProfitCardSelector-content")[0].firstChild.contentWindow.document;

		const selectInput = dropIframeDocument.querySelectorAll("input")[0];
		selectInput.value = selectedProduct;
		setTimeout(addProduct, 3000)
	}
	
	function addProduct() {
		const addBtn = dropIframeDocument.querySelector(".css-11igpbb");
		
		click(addBtn, add);    
	}
	
	// 确认添加商品
	function add() {
		Array.from(dropIframeDocument.querySelectorAll("button")).find(el => el.innerText == "确定").click();   
	}
	
	function appendAnswer() {
		const answer = document.createElement("span")
		answer.setAttribute("data-text", true);
		answer.innerText = answerText;
		
		const span = Array.from(document.querySelectorAll("span")).find(el => el.getAttribute("data-offset-key"))
		span.removeChild(span.firstChild);

		Array.from(document.querySelectorAll("span"))
		.find(el => el.getAttribute("data-offset-key"))
		.appendChild(answer);

		setTimeout(clickWallet, 2000);

	}`)
}
	
const ZhihuScript = {
	WriteURL,
	updateProducts,
	chatType,
	chatQuestion,
	publishAnswer,
}
export default ZhihuScript;
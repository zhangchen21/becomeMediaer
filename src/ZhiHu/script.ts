
const WriteURL = "https://www.zhihu.com/question/584235535#write";

const updateProducts = function updateProducts() {
	const Products = {

	};

	var iframe = document.getElementById("updateProducts").contentWindow;

	const selectBtn = iframe.document.getElementsByClassName("Button InputLike InputButton Select-button MCNGoodSearchCategorySelect-selectButton")[0];
	selectBtn.click();

	function copyToClipboard(str) {
		const el = iframe.document.createElement('textarea');
		el.value = str;
		iframe.document.body.appendChild(el);
		el.select();
		iframe.document.execCommand('copy');
		iframe.document.body.removeChild(el);
	}

	function clickAndRedraw(elements) {
		let i = 0;
		function clickNext() {
			if (i >= elements.length) {
				copyToClipboard(JSON.stringify(Products));
				console.log("已复制到剪贴板！");
				return;
			}

			const selectBtn = iframe.document.getElementsByClassName("Button InputLike InputButton Select-button MCNGoodSearchCategorySelect-selectButton")[0];
			selectBtn.click();

			const typeBtns = Array.from(iframe.document.querySelectorAll(".Select-option"));
			typeBtns[i].click();

			setTimeout(() => {
				getProducts();
				i ++;
				clickNext();
			}, 1000);
		}

		function getProducts() {
			// Get products in this type
			const products = Array.from(
				iframe.document.querySelectorAll(".css-a68l8f")
			).slice(0, 5).map(el => el.innerText);

			Products[typeBtns[i].innerText] = products;
		}

		clickNext();
	}

	const typeBtns = Array.from(iframe.document.querySelectorAll(".Select-option"));
	clickAndRedraw(typeBtns);
};

const ZhiHu = {
	WriteURL,
	updateProducts
}

export default ZhiHu;
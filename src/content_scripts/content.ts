module BrowserExtension {
	export class ContentScript {
		public initialize = () => {
			let iframes = document.getElementsByTagName("iframe");
			for (let index = 0; index < iframes.length; index++) {
				let element = iframes[index];
				element.style.height = "1000px";
				
			}
		}
	}
}

var contentScript = new BrowserExtension.ContentScript();
contentScript.initialize();


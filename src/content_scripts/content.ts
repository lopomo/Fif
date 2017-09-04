module BrowserExtension {
	export class ContentScript {
		public initialize = () => {
			let mainPanel = document.getElementById("panel_teamassignment");
			if (mainPanel) {
				let iframes = mainPanel.getElementsByTagName("iframe");
				for (let index = 0; index < iframes.length; index++) {
					let element = iframes[index];
					element.style.height = "1000px";
					
				}
			}
		}
	}
}

var contentScript = new BrowserExtension.ContentScript();
contentScript.initialize();


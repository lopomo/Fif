namespace Fif {
	export class ContentScript {
		public initialize = () => {
			const mainPanel = document.getElementById('panel_teamassignment');
			if (mainPanel) {
				const iframes = mainPanel.getElementsByTagName('iframe');
				for (let index = 0; index < iframes.length; index++) {
					const element = iframes[index];
					element.style.height = '1000px';
				}
			}
		}
	}
}

const contentScript = new Fif.ContentScript();
contentScript.initialize();


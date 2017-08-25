module BrowserExtension {
	export class ContentScriptResource {
		public initialize = () => {
			let tabContent = document.getElementsByClassName("tab-content");
			for (let index = 0; index < tabContent.length; index++) {
				let element = (<HTMLElement>tabContent[index]);
				element.style.height = "600px";
			}
			let layout = document.getElementById("customLayoutConfig");
			if(layout) {
				layout.style.height = "500px";
			}
			
			if (!document.getElementById("PopiciAwesomeFormatButton")) {
				let div = document.createElement("button");
				div.innerHTML = `Format`;
				div.setAttribute("class", "btn");
				div.id = 'PopiciAwesomeFormatButton';
				div.addEventListener("click", () => {
					let area = (<HTMLInputElement>document.getElementById("customLayoutConfig"));
					area.value = vkbeautify.xml(area.value);
				});
				document.getElementById("teamAssignmentListButtonsContainer").appendChild(div);
			}

			document.removeEventListener("keydown", this.save);
			document.addEventListener("keydown", this.save, false);
		}

		private save(e) {
			if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				let saveButton = document.querySelectorAll('[widgetid="teamAssignmentSaveButton"]');
				if (saveButton.length !== 0) {
					let saveButtonInput = (<HTMLInputElement>saveButton.item(0).firstChild);
					saveButtonInput.click();
				}
			}	
		}
	}
}

var contentScriptResource = new BrowserExtension.ContentScriptResource();
contentScriptResource.initialize();


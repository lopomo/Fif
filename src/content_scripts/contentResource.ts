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

			document.removeEventListener("keydown", this.handleKeyboardShotcut);
			document.addEventListener("keydown", this.handleKeyboardShotcut, false);
		}

		private handleKeyboardShotcut(e) {
			if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				let saveButton = document.querySelectorAll('[widgetid="teamAssignmentSaveButton"]');
				if (saveButton.length !== 0) {
					let saveButtonInput = (<HTMLInputElement>saveButton.item(0).firstChild);
					saveButtonInput.click();
				}
			}
			if (e.keyCode == 68 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				if (document.activeElement == document.getElementById("customLayoutConfig")) {
					var textarea = document.getElementById("customLayoutConfig") as HTMLTextAreaElement;
					var oldLines = textarea.value.split("\n");
					var lineNumber = textarea.value.substr(0, textarea.selectionStart).split("\n").length - 1;
					if (oldLines[lineNumber].indexOf("<!--") != -1 && oldLines[lineNumber].indexOf("-->") != -1) {
						oldLines[lineNumber] = oldLines[lineNumber].replace(/(<!--)|(-->)/g, '');
					}
					else {
						oldLines[lineNumber] = "<!--" + oldLines[lineNumber] + "-->";
					}
					textarea.value = oldLines.join("\r\n");
					var formatButton = document.getElementById("PopiciAwesomeFormatButton") as HTMLButtonElement;
					formatButton.focus();
				}
			}
		}
	}
}

var contentScriptResource = new BrowserExtension.ContentScriptResource();
contentScriptResource.initialize();


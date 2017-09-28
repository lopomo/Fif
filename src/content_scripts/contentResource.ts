module BrowserExtension {
	export class ContentScriptResource {
		public initialize = () => {
			chrome.runtime.onMessage.addListener(this.handleReceivedLayouts);
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

			if (!document.getElementById("PopiciAwesomeSwitchButton")) {
				let div = document.createElement("button");
				div.innerHTML = `Switch Dev/Prod`;
				div.setAttribute("class", "btn");
				div.id = 'PopiciAwesomeSwitchButton';
				div.addEventListener("click", () => {
					let area = (<HTMLInputElement>document.getElementById("customLayoutConfig"));
					let newChange = area.value;
					if(area.value.indexOf('GadgetsVS') !== -1) {
						newChange = newChange.replace(/GadgetsVS/gi, '2Ring/Gadgets');
					} else {
						newChange = newChange.replace(/2Ring\/Gadgets/gi, 'GadgetsVS')
					}
					area.value = newChange;
					var e = document.createEvent('HTMLEvents');
					e.initEvent("keyup", false, true);
					area.dispatchEvent(e);
				});
				document.getElementById("teamAssignmentListButtonsContainer").appendChild(div);
			}

			if (!document.getElementById("PopiciAwesomeSaveButton")) {
				let div = document.createElement("button");
				let input = document.createElement("input");
				input.id = 'PopiciAwesomeSaveInput';
				input.style.height = "20px";
				input.style.position = "relative";
				input.style.top = "-4px";
				input.style["margin-left"] = "30px";
				div.innerHTML = `Save current layout`;
				div.setAttribute("class", "btn");
				div.id = 'PopiciAwesomeSaveButton';
				div.addEventListener("click", () => {
					let layoutName = document.getElementById("PopiciAwesomeSaveInput") as HTMLInputElement;
					if (layoutName.value.trim()) {
						let area = (<HTMLInputElement>document.getElementById("customLayoutConfig"));
						var e = document.createEvent('HTMLEvents');
						e.initEvent("keyup", false, true);
						area.dispatchEvent(e);
						chrome.runtime.sendMessage({ command: "save", value: { label: layoutName.value.trim(), value: area.value } });
					}
					else { 
						alert("LayoutName has to be specified")
					}
				});
				document.getElementById("teamAssignmentListButtonsContainer").appendChild(input);
				document.getElementById("teamAssignmentListButtonsContainer").appendChild(div);
			}
			chrome.runtime.sendMessage({ command: "getLayouts" });

			document.removeEventListener("keydown", this.handleKeyboardShotcut);
			document.addEventListener("keydown", this.handleKeyboardShotcut, false);
		}

		private handleKeyboardShotcut = (e) => {
			if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				this.clickSave();
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

		private clickSave () {
			let saveButton = document.querySelectorAll('[widgetid="teamAssignmentSaveButton"]');
			if (saveButton.length !== 0) {
				let saveButtonInput = (<HTMLInputElement>saveButton.item(0).firstChild);
				var e = document.createEvent('HTMLEvents');
				e.initEvent("keyup", false, true);
				document.getElementById("customLayoutConfig").dispatchEvent(e);
				saveButtonInput.click();
			}
		}

		private createSelect = (options: Array<{label: string, value: string}>) => { 
			var selectList = document.createElement("select");
			selectList.id = "PopiciAwesomeLoadSelect";
			selectList.style["margin-left"] = "30px";
			selectList.style.width = "100px";
			var area = <HTMLTextAreaElement>document.getElementById("customLayoutConfig");
			var option = document.createElement("option");
			option.value = "";
			option.text = "Select layout";
			selectList.appendChild(option);
			for (var i = 0; i < options.length; i++) {
				var option = document.createElement("option");
				option.value = options[i].value;
				option.text = options[i].label;
				selectList.appendChild(option);
			}
			selectList.addEventListener("change", () => {
				if(selectList.value) {
					area.value = selectList.value;
					var e = document.createEvent('HTMLEvents');
					e.initEvent("keyup", false, true);
					area.dispatchEvent(e);
				}
			});
			if (!document.getElementById("PopiciAwesomeLoadSelect")) {
				document.getElementById("teamAssignmentListButtonsContainer").appendChild(selectList);
			}
			else { 
				document.getElementById("teamAssignmentListButtonsContainer").replaceChild(selectList, document.getElementById("PopiciAwesomeLoadSelect"));
			}
		}

		private handleReceivedLayouts = (options: Array<{ label: string, value: string }>) => { 
			this.createSelect(options)
		}
	}
}

var contentScriptResource = new BrowserExtension.ContentScriptResource();
contentScriptResource.initialize();


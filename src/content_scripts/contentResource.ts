namespace Fif {
	export class ContentScriptResource {
		public initialize = () => {
			chrome.runtime.onMessage.addListener(this.handleReceivedLayouts);
			const tabContent = document.getElementsByClassName('tab-content');
			for (let i = 0; i < tabContent.length; i++) {
				const element = tabContent[i] as HTMLElement;
				element.style.height = '600px';
			}
			const layout = document.getElementById('customLayoutConfig');
			if (layout) {
				layout.style.height = '500px';
			}

			if (!document.getElementById('FifFormatButton')) {
				const div = document.createElement('button');
				div.innerHTML = `Format`;
				div.setAttribute('class', 'btn');
				div.id = 'FifFormatButton';
				div.addEventListener('click', () => {
					const area = document.getElementById('customLayoutConfig') as HTMLInputElement;
					area.value = vkbeautify.xml(area.value);
				});
				const el = document.getElementById('teamAssignmentListButtonsContainer');
				if (el) {
					el.appendChild(div);
				}
			}

			if (!document.getElementById('FifReplaceButton')) {
				const buttonReplace = document.createElement('button');
				const buttonSwitch = document.createElement('button');
				const inputFrom = document.createElement('input');
				inputFrom.type = 'text';
				inputFrom.id = 'FifReplaceFromInput';
				const inputTo = document.createElement('input');
				inputTo.type = 'text';
				inputTo.id = 'FifReplaceToInput';


				buttonSwitch.innerHTML = `<>`;
				buttonSwitch.setAttribute('class', 'btn');
				buttonSwitch.id = 'FifSwitchButton';
				buttonSwitch.addEventListener('click', () => {
					const fromValue = inputFrom.value;
					const toValue = inputTo.value;
					inputTo.value = fromValue;
					inputFrom.value = toValue;
				});


				buttonReplace.innerHTML = `Replace`;
				buttonReplace.setAttribute('class', 'btn');
				buttonReplace.id = 'FifReplaceButton';
				buttonReplace.addEventListener('click', () => {
					const area = document.getElementById('customLayoutConfig') as HTMLInputElement;
					const fromValue = inputFrom.value;
					const toValue = inputTo.value;
					let newChange = area.value;
					newChange = newChange.replace(fromValue, toValue);
					area.value = newChange;
					const event = document.createEvent('HTMLEvents');
					event.initEvent('keyup', false, true);
					area.dispatchEvent(event);
				});
				const el = 	document.getElementById('teamAssignmentListButtonsContainer')
				if (el) {
					el.appendChild(inputFrom);
					el.appendChild(buttonSwitch);
					el.appendChild(inputTo);
					el.appendChild(buttonReplace);
				}
			}

			if (!document.getElementById('FifSaveButton')) {
				const div = document.createElement('button');
				const input = document.createElement('input');
				input.id = 'FifSaveInput';
				input.type = 'text'
				div.innerHTML = `Save current layout`;
				div.setAttribute('class', 'btn');
				div.id = 'FifSaveButton';
				div.addEventListener('click', () => {
					const layoutName = document.getElementById('FifSaveInput') as HTMLInputElement;
					if (layoutName.value.trim()) {
						const area = document.getElementById('customLayoutConfig') as HTMLInputElement;
						this.invokeKeyboardEvent(area);
						chrome.runtime.sendMessage({ command: 'save', value: { label: layoutName.value.trim(), value: area.value } });
					} else {
						alert('LayoutName has to be specified')
					}
				});
				const el = document.getElementById('teamAssignmentListButtonsContainer');
				if (el) {
					el.appendChild(input);
					el.appendChild(div);
				}
			}
			chrome.runtime.sendMessage({ command: 'getLayouts' });

			document.removeEventListener('keydown', this.handleKeyboardShotcut);
			document.addEventListener('keydown', this.handleKeyboardShotcut, false);
		}

		private handleKeyboardShotcut = (e) => {
			if (e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				this.clickSave();
			}
			if (e.keyCode == 68 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
				e.preventDefault();
				if (document.activeElement == document.getElementById('customLayoutConfig')) {
					var textarea = document.getElementById('customLayoutConfig') as HTMLTextAreaElement;
					var oldLines = textarea.value.split('\n');
					var lineNumber = textarea.value.substr(0, textarea.selectionStart).split('\n').length - 1;
					if (oldLines[lineNumber].indexOf('<!--') != -1 && oldLines[lineNumber].indexOf('-->') != -1) {
						oldLines[lineNumber] = oldLines[lineNumber].replace(/(<!--)|(-->)/g, '');
					} else {
						oldLines[lineNumber] = '<!--' + oldLines[lineNumber] + '-->';
					}
					textarea.value = oldLines.join('\r\n');
					var formatButton = document.getElementById('FifFormatButton') as HTMLButtonElement;
					formatButton.focus();
				}
			}
		}

		private clickSave = () => {
			const saveButton = document.querySelectorAll('[widgetid="teamAssignmentSaveButton"]');
			if (saveButton.length !== 0) {
				const saveButtonInput = saveButton.item(0).firstChild as HTMLInputElement;
				this.invokeKeyboardEvent(document.getElementById('customLayoutConfig'));
				saveButtonInput.click();
			}
		}

		private createSelect = (options: Array<{label: string, value: string}>) => {
			const selectList = document.createElement('select');
			selectList.id = 'FifLoadSelect';
			selectList.style.marginLeft = '30px';
			selectList.style.width = '100px';
			const area = document.getElementById('customLayoutConfig') as HTMLTextAreaElement;
			const firstOption = document.createElement('option');
			firstOption.value = '';
			firstOption.text = 'Select layout';
			selectList.appendChild(firstOption);
			for (const option of options) {
				const nextOption = document.createElement('option');
				nextOption.value = option.value;
				nextOption.text = option.label;
				selectList.appendChild(nextOption);
			}
			selectList.addEventListener('change', () => {
				if(selectList.value) {
					area.value = selectList.value;
					var e = document.createEvent('HTMLEvents');
					e.initEvent('keyup', false, true);
					area.dispatchEvent(e);
				}
			});
			const el = document.getElementById('teamAssignmentListButtonsContainer');
			if (!document.getElementById('FifLoadSelect')) {
				el.appendChild(selectList);
			} else {
				el.replaceChild(selectList, document.getElementById('FifLoadSelect'));
			}
		}

		private handleReceivedLayouts = (options: Array<{ label: string, value: string }>) => this.createSelect(options);

		private invokeKeyboardEvent(element: HTMLElement) {
			const event = document.createEvent('HTMLEvents');
			event.initEvent('keyup', false, true);
			element.dispatchEvent(event);
		}
	}
}

const contentScriptResource = new Fif.ContentScriptResource();
contentScriptResource.initialize();


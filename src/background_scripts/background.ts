namespace Fif {
	export class BackgroundScript {
		public initialize = () => {
			chrome.runtime.onMessage.addListener(this.contentScriptMessageReceived);
			chrome.storage.local.get(this.initializeConfiguration);
			chrome.storage.onChanged.addListener(this.handleConfigChange);
			chrome.tabs.query({ title: 'Cisco Finesse Administration' },
				(tabs) => {
					tabs.forEach((tab) => {
						chrome.tabs.executeScript(tab.id, { file: 'content_scripts/content.js' });

						chrome.webNavigation.onCompleted.addListener((details) => {
							chrome.tabs.executeScript(tab.id, { file: 'lib/vkbeautify.min.js', frameId: details.frameId }, () => {
								chrome.tabs.executeScript(tab.id, { file: 'content_scripts/contentResource.js', frameId: details.frameId });
							});
						},
							{
								url: [{ urlContains: 'TeamResources.jsp' }]
							});
					});
				}
			);
			chrome.tabs.onUpdated.addListener(this.loadContentScript);
		}

		private initializeConfiguration = (data) => {
			var layouts: Array<{ lable: string, value: string }> = data.layouts;
			layouts = layouts ? layouts : []; 
			chrome.tabs.query({ title: 'Cisco Finesse Administration' },
				(tabs) => {
					tabs.forEach((tab) => {
						chrome.tabs.sendMessage(tab.id, layouts);
					});
				}
			);
		}

		private handleConfigChange = () => { 
			chrome.storage.local.get(this.initializeConfiguration);
		}

		private loadContentScript = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
			if (tab.title == 'Cisco Finesse Administration') {
				chrome.tabs.executeScript(tab.id, { file: 'content_scripts/content.js', runAt: 'document_start' });
				chrome.webNavigation.getAllFrames({ tabId: tab.id }, (frames) => {
					for (const frame of frames) {
						if (frame.url.indexOf('TeamResources.jsp') !== -1) {
							chrome.tabs.executeScript(tab.id, { file: 'content_scripts/vkbeautify.min.js', frameId: frame.frameId, runAt: 'document_start'}, () => {
								chrome.tabs.executeScript(tab.id, { file: 'content_scripts/contentResource.js', frameId: frame.frameId, runAt: 'document_start'});
							});
						}
					}
				});
			}
		}

		private contentScriptMessageReceived = (request, sender, sendResponse) => {
			switch (request.command) {
				case 'save':
					chrome.storage.local.get((data) => {
						var layouts: Array<{ lable: string, value: string }> = data.layouts;
						layouts = layouts ? layouts : [];
						layouts.push(request.value);
						chrome.storage.local.set({layouts: layouts});
					});
					break;
				case 'remove':
				case 'getLayouts':
					this.handleConfigChange();
					break;
				default:
					console.error('BackgroundScript: received unknown command from content script: ' + request.command);
			}
		}
	}
}

const backgroundScript = new Fif.BackgroundScript();
backgroundScript.initialize();

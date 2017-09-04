module BrowserExtension {
	export class BackgroundScript {
		
		public initialize = () => {
			chrome.tabs.query({ title: "Cisco Finesse Administration" },
				(tabs) => {
					tabs.forEach((tab) => {
						chrome.tabs.executeScript(tab.id, { file: "content_scripts/content.js" });

						chrome.webNavigation.onCompleted.addListener((details) => {
							chrome.tabs.executeScript(tab.id, { file: "lib/vkbeautify.min.js", frameId: details.frameId }, () => {
								chrome.tabs.executeScript(tab.id, { file: "content_scripts/contentResource.js", frameId: details.frameId });
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

		private loadContentScript = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
			if (tab.title == "Cisco Finesse Administration") {
				chrome.tabs.executeScript(tab.id, { file: "content_scripts/content.js", runAt: 'document_start' });
				chrome.webNavigation.getAllFrames({ tabId: tab.id }, (frames) => {
					for (let frame of frames) {
						if (frame.url.indexOf('TeamResources.jsp') !== -1) {
							chrome.tabs.executeScript(tab.id, { file: "content_scripts/vkbeautify.min.js", frameId: frame.frameId, runAt: 'document_start'}, () => {
								chrome.tabs.executeScript(tab.id, { file: "content_scripts/contentResource.js", frameId: frame.frameId, runAt: 'document_start'});
							});
						}
					}
				});	
			}
		}
	}

	var backgroundScript = new BackgroundScript();
	backgroundScript.initialize();
}
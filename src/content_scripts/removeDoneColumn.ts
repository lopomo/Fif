namespace Fif {
	export class RemoveDoneColumnScript {
        private doneState: boolean;
		public initialize = () => {
            chrome.storage.local.get(this.handleInit);
            chrome.storage.onChanged.addListener(this.handleChange);

            const createCopyButton = document.querySelectorAll('.vc-branches-container');
            if (createCopyButton.length > 0 && !document.getElementById('cc_copyBranchNameButton')) {
                var template = document.createElement('div');
                template.id = 'cc_copyBranchNameButton';
                template.style.position = 'absolute';
                template.className = 'bowtie-edit-copy bowtie-icon icon';
                template.style.top = '17px';
                template.style.left = '0px';
                template.style.cursor = 'pointer';
                template.onclick = () => {
                    const branchName = createCopyButton[0].querySelector('.filtered-list-dropdown-menu');
                    const n = branchName.attributes.getNamedItem('title').value;
                    this.copyStringToClipboard(n);
                };
                createCopyButton[0].appendChild(template);
            }


            const targetNode = document.getElementById('PopupContentContainer');
            const config = { attributes: false, childList: true, subtree: false };
            const observer = new MutationObserver((mutationsList, observer) => {
                const createBranchDialog = document.querySelectorAll('.ui-dialog.vc-create-branch-dialog-fix');
                if (createBranchDialog.length > 0 && !document.getElementById('generateBranchNameButton')) {
                    var template = document.createElement('button');
                    template.id = 'generateBranchNameButton';
                    template.innerHTML = `<span class="ui-button-text">Generate Name</span>`;
                    template.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only";
                    template.style.cssFloat = 'left';
                    template.onclick = () => {
                       const storyName = createBranchDialog[0].querySelector('.vc-create-branch-dialog .filtered-list-dropdown-menu.vc-git-selector-menu-right .selected-item-text');
                       const taskName = createBranchDialog[0].querySelector('.la-primary-data a');
                       const destinationInput = createBranchDialog[0].querySelector('.bowtie-style input[type=text]');

                        const trueStoryName = storyName.innerHTML.split('/')[0];
                        const taskNameAsBranchName = taskName.innerHTML.toLowerCase().replace(/[!@#$%^&*/(), .?":{}|<>]/g, '_');
                        if (trueStoryName === 'dev') {
                            (destinationInput as HTMLInputElement).value =  taskNameAsBranchName + '/story';
                        } else {
                            (destinationInput as HTMLInputElement).value =  trueStoryName + '/' + taskNameAsBranchName;
                        }

                        const event = document.createEvent('HTMLEvents');
                        event.initEvent('keyup', false, true);
                        destinationInput.dispatchEvent(event);
                    };
                    createBranchDialog[0].querySelector('.ui-dialog-buttonset').appendChild(template);
                }
            });
            if (targetNode) {
                observer.observe(targetNode, config);
            }
        }

        private handleInit = (data: any) => {
            if (this.doneState != data.doneState) {
                this.doneState = data.doneState;
                this.handleDoneStateChange();
            }
        }

        private copyStringToClipboard (str) {
            // Create new element
            var el = document.createElement('textarea');
            // Set value (string to be copied)
            el.value = str;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
         }

        private handleChange = () => {
            chrome.storage.local.get(this.handleInit);
        }

        private handleDoneStateChange = () => {
            let width, display, tableLayout;
            if (this.doneState) {
                width = '16.6667%';
                display = 'table-cell';
                tableLayout = 'fixed';
            } else {
                width = '20%';
                display = 'none';
                tableLayout = 'auto';
            }
            var others = document.querySelectorAll('td.taskboard-cell.ui-droppable[axis*="taskboard-table-body_s"]');
            for(let i = 0; i < others.length; i++) {
                others[i].setAttribute("style", `width: ${width};`);
            }
            var headers = document.querySelectorAll('th.taskboard-cell[id*="taskboard-table-header_s"]');
            for(let i = 0; i < headers.length; i++) {
                headers[i].setAttribute("style", `width: ${width};`);
            }
            var lastcolumns = document.querySelectorAll('td.taskboard-cell.ui-droppable[axis="taskboard-table-body_s5"]');
            for(let i = 0; i < lastcolumns.length; i++) {
                (lastcolumns[i] as HTMLElement).style.display = display;
            }
            if (document.getElementById('taskboard-table-header_s5')) {
                document.getElementById('taskboard-table-header_s5').style.display = display;
            }
            if (document.getElementById('taskboard-table-body')) {
                document.getElementById('taskboard-table-body').style['table-layout'] = tableLayout;
            }
            if (document.getElementById('taskboard-table-header')) {
                document.getElementById('taskboard-table-header').style['table-layout'] = tableLayout;
            }
        }
        
	}
}

let removeDoneColumnScript = null;
if (!removeDoneColumnScript) {
    removeDoneColumnScript = new Fif.RemoveDoneColumnScript();
    removeDoneColumnScript.initialize();
}

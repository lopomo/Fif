namespace Fif {
	export class RemoveDoneColumnScript {
		public initialize = () => {
            const lastcolumns = document.querySelectorAll('td.taskboard-cell.ui-droppable[axis="taskboard-table-body_s5"]');
            for(let i = 0; i < lastcolumns.length; i++) {
                lastcolumns[i].innerHTML = '';
            }
		}
	}
}

const removeDoneColumnScript = new Fif.RemoveDoneColumnScript();
removeDoneColumnScript.initialize();


namespace Fif {
	export class RemoveDoneColumnScript {
		public initialize = () => {
            const lastcolumns = document.querySelectorAll('td.taskboard-cell.ui-droppable[axis="taskboard-table-body_s5"]');
            for(let i = 0; i < lastcolumns.length; i++) {
                lastcolumns[i].remove();
            }
            document.getElementById('taskboard-table-body').style['table-layout'] = 'auto';
            document.getElementById('taskboard-table-header').style['table-layout'] = 'auto';
            document.getElementById('taskboard-table-header_s5').remove();
            const others = document.querySelectorAll('td.taskboard-cell.ui-droppable[axis*="taskboard-table-body_s"]');
            for(let i = 0; i < others.length; i++) {
                others[i].setAttribute("style", "width: 20%;");
            }
            const headers = document.querySelectorAll('th.taskboard-cell[id*="taskboard-table-header_s"]');
            for(let i = 0; i < headers.length; i++) {
                headers[i].setAttribute("style", "width: 20%;");
            }
		}
	}
}

const removeDoneColumnScript = new Fif.RemoveDoneColumnScript();
removeDoneColumnScript.initialize();


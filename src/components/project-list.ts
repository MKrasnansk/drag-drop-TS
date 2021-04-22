/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../models/project-model.ts" />
/// <reference path="../models/drag-drop-interface.ts" />
namespace App {
	//Project List Class
	export class ProjectList extends Component <HTMLDivElement, HTMLElement>
		implements DragTarget {
		assignetProject : Project[]
		constructor(private type : 'active' | 'finished') {
			super('project-list', 'app', false, `${type}-projects`)
			this.assignetProject = []
			this.configure()
			this.renderContent()
		}
		@autobind dragOverHandler(event : DragEvent) {
			if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
				event.preventDefault()
				const listEl = this.element.querySelector('ul')!
				listEl.classList.add('droppable')
			}
		}
		@autobind dropHandler(event : DragEvent) {
			const prjId = event.dataTransfer!.getData('text/plain')
			projectState.moveProject(prjId,
			                         this.type ===
			                         'active' ? ProjectStatus.Active : ProjectStatus.Fnished,
			)
		}
		@autobind dragLeaveHandler(_ : DragEvent) {
			const listEl = this.element.querySelector('ul')!
			listEl.classList.remove('droppable')
		}
		configure() {
			this.element.addEventListener('dragover', this.dragOverHandler)
			this.element.addEventListener('dragleave', this.dragLeaveHandler)
			this.element.addEventListener('drop', this.dropHandler)
			projectState.addListener((projects : Project[]) => {
				const relevantProject = projects.filter(prj => {
					if (this.type === 'active') {
						return prj.status === ProjectStatus.Active
					}
					return prj.status === ProjectStatus.Fnished
				})
				this.assignetProject = relevantProject
				this.renderProject()
			})
		}
		renderContent() {
			const listId = `${this.type}-projects-list`
			this.element.querySelector('ul')!.id = listId
			this.element.querySelector('h2')!.textContent =
				this.type.toUpperCase() + ' PROJECTS'
		}
		private renderProject() {
			const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
			listEl.innerHTML = ''
			for (const prjItem of this.assignetProject) {
				new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
			}
		}
	}
}
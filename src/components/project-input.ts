import Cmp                from './base-component'
import * as Valid         from '../util/validation'
import {autobind as Bind} from '../decorators/autobind'
import {projectState}     from '../state/project-state'


//ProjectInput class
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement> {
	titleInputElement : HTMLInputElement
	descriptionInputElement : HTMLInputElement
	peopleInputElement : HTMLInputElement
	constructor() {
		super('project-input', 'app', true, 'user-input')
		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
		this.descriptionInputElement =
			this.element.querySelector('#description') as HTMLInputElement
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement
		this.configure()
	}
	configure() {
		this.element.addEventListener('submit', this.submitHandler)
	}
	renderContent() {
	}
	private gatherUserInput() : [string, string, number] | void {
		const enteredTitle = this.titleInputElement.value
		const enteredDescription = this.descriptionInputElement.value
		const enteredPeople = this.peopleInputElement.value
		const titleValidatable : Valid.Validatable = {
			value: enteredTitle,
			required: true,
		}
		const descriptionValidatable : Valid.Validatable = {
			value: enteredDescription,
			required: true,
			minLength: 5,
		}
		const peopleValidatable : Valid.Validatable = {
			value: +enteredPeople,
			required: true,
			min: 1,
			max: 5,
		}
		if (!Valid.validate(titleValidatable) || !Valid.validate(descriptionValidatable) ||
		    !Valid.validate(peopleValidatable)) {
			alert('Invalid Input!')
			return
		} else {
			return [
				enteredTitle,
				enteredDescription,
				+enteredPeople]
		}
	}
	private clearInputs() {
		this.titleInputElement.value = ''
		this.descriptionInputElement.value = ''
		this.peopleInputElement.value = ''
	}
	@Bind //alias z importu
	private submitHandler(event : Event) {
		event.preventDefault()
		const userInput = this.gatherUserInput()
		if (Array.isArray(userInput)) {
			const [title, desc, people] = userInput
			console.log(title, desc, people)
			projectState.addProject(title, desc, people)
			this.clearInputs()
		}
	}
}

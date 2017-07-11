'use strict'

const widget = require('virtual-widget')
const h = require('hyperscript')
const {addEventListener: on, removeEventListener: off} = require('add-event-listener')

const className = 'virtual-dom-autocomplete'

const defaults = {
	placeholder: null
}

function Autocomplete (text, suggest, onChange, opt = {}) {
	if (!(this instanceof Autocomplete)) return new Autocomplete(suggest, onChange, opt)

	this.text = text || ''
	this.placeholder = opt.placeholder || defaults.placeholder || ''
	this.onChange = onChange
	this.suggest = suggest

	this.wrapperEl = null
	this.inputEl = null
	this.onKeypress = null
	this.suggestionsEl = null
}

const p = Autocomplete.prototype
p.type = 'Widget'

p.init = function init () {
	const inputEl = this.inputEl = h('input', {
		class: className + '-input',
		type: 'text',
		placeholder: this.placeholder,
		value: this.text
	})
	this.wrapperEl = h('div', {class: className}, inputEl)

	const self = this
	this.onKeypress = (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return
		setTimeout(() => {
			if (e.target.value !== this.text) self.onChange.call({}, e.target.value)
		}, 1)
	}
	on(this.inputEl, 'keypress', this.onKeypress)

	this.updateSuggestions()
	return this.wrapperEl
}

p.update = function update (old) {
	console.log('applying to DOM', this.text, old.text, this.placeholder, old.placeholder)
	if (!this.wrapperEl) this.init()

	if (this.text !== old.text) { // text changed
		this.inputEl.value = this.text
		// this.updateSuggestions()
	}
	if (this.placeholder !== old.placeholder) { // placeholder changed
		this.inputEl.setAttribute('placeholder', this.placeholder)
	}

	return this.wrapperEl
}

p.updateSuggestions = function updateSuggestions () {
	const suggestions = this.suggest.call({}, this.text)
	console.log('new suggestions', suggestions)
	const rendered = h('div', {
		class: className + '-suggestions'
	}, suggestions.map(this.renderSuggestion))

	if (this.suggestionsEl) this.wrapperEl.removeChild(this.suggestionsEl)
	this.wrapperEl.appendChild(this.suggestionsEl = rendered)
}

p.renderSuggestion = function renderSuggestion (text) {
	return null
}

p.destroy = function destroy () {
	off(this.inputEl, 'keypress', this.onKeypress)
}

module.exports = Autocomplete

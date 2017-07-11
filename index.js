'use strict'

const widget = require('virtual-widget')
const h = require('hyperscript')
const {addEventListener: on, removeEventListener: off} = require('add-event-listener')

const className = 'vdom-autocomplete'

const defaults = {
	placeholder: null
}

function Autocomplete (text, suggest, onChange, opt = {}) {
	if (!(this instanceof Autocomplete)) return new Autocomplete(suggest, onChange, opt)

	this.text = text || ''
	this.placeholder = opt.placeholder || defaults.placeholder || ''
	this.onChange = onChange // todo: actually call this
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
		className: className + '-input',
		type: 'text',
		placeholder: this.placeholder,
		value: this.text
	})
	this.wrapperEl = h('div', {className}, inputEl)

	const self = this
	this.onKeypress = (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return
		setTimeout(() => {
			if (e.target.value !== this.text) self.onChange.call({}, e.target.value)
		}, 1)
	}
	on(this.inputEl, 'keypress', this.onKeypress)

	return this.wrapperEl
}

p.update = function update (old) {
	this.wrapperEl = this.wrapperEl || old.wrapperEl
	this.inputEl = this.inputEl || old.inputEl
	this.onKeypress = this.onKeypress || old.onKeypress
	this.suggestionsEl = this.suggestionsEl || old.suggestionsEl
	if (!this.wrapperEl) this.init()

	if (this.text !== this.inputEl.value) this.inputEl.value = this.text
	if (this.text !== old.text) this.renderSuggestions()
	if (this.placeholder !== this.inputEl.getAttribute('placeholder')) {
		this.inputEl.setAttribute('placeholder', this.placeholder)
	}

	return null
}

p.destroy = function destroy () {
	off(this.inputEl, 'keypress', this.onKeypress)
}

p.renderSuggestions = function renderSuggestions () {
	const self = this
	const renderSuggestion = (text) => {
		const el = h('li', {className: className + '-suggestion'}, text)
		on(el, 'click', () => {
			if (self.inputEl.value !== text) self.onChange.call({}, text)
		})
		return el
	}

	const suggestions = this.suggest.call({}, this.text)
	const rendered = h('ul', {
		className: className + '-suggestions'
	}, suggestions.map(renderSuggestion))

	if (this.suggestionsEl) this.wrapperEl.removeChild(this.suggestionsEl)
	this.wrapperEl.appendChild(this.suggestionsEl = rendered)
}

module.exports = Autocomplete

'use strict'

const widget = require('virtual-widget')
const h = require('hyperscript')
const on = require('add-event-listener')

const className = 'virtual-dom-autocomplete'

const defaults = {
	placeholder: null
}

function Autocomplete (text, suggest, onChange, opt = {}) {
	if (!(this instanceof Autocomplete)) return new Autocomplete(suggest, onChange, opt)

	this.text = text
	this.onChange = onChange
	this.suggest = suggest
	this.placeholder = opt.placeholder || defaults.placeholder
}
Autocomplete.prototype.type = 'Widget'

Autocomplete.prototype.init = function init () {
	this.el = h('input', {
		type: 'text',
		placeholder: this.placeholder || '',
		value: this.text || ''
	})

	const onKeypress = (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return
		const self = this
		setTimeout(() => {
			self.onChange.call({}, e.target.value)
		}, 1)
	}
	on(this.el, 'keypress', onKeypress)

	return this.el
}

Autocomplete.prototype.update = function update (update) {
	if (this.el !== update.el) {
		this.el = update.el
		this.text = update.text
	} else if (this.el.value !== update.text) {
		this.el.value = this.text = update.text
		const suggestions = this.suggest.call({}, this.text)
		// todo
	}
}

module.exports = Autocomplete

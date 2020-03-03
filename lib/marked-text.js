module.exports = text => {
	// 8288 = zero width no-break space https://en.wikipedia.org/wiki/Word_joiner
	[
		{
			regex: /([^\s])—([^\s])/g,
			replacement: '$1&ThinSpace;&mdash;&ThinSpace;$2' // can break
		},
		{
			regex: /( |&nbsp;)—( |&nbsp;)/g,
			replacement: '&ThinSpace;&mdash;&ThinSpace;' // can break
		},
		{
			regex: /—( |&nbsp;)/g,
			replacement: '&#8288;&mdash;&ThinSpace;' // em dash should stick with word
		},
		{
			regex: /( |&nbsp;)—/g,
			replacement: '&ThinSpace;&mdash;&#8288;' // em dash should stick with word
		},
	].forEach(replacer => {
		text = text.replace(replacer.regex, replacer.replacement)
	})
	return text
}

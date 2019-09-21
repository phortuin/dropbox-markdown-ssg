const marked = require('marked')
const markdownRenderer = new marked.Renderer()

marked.setOptions({
	gfm: true,
	breaks: true,
})

markdownRenderer.image = require('./marked-image')
markdownRenderer.paragraph = require('./marked-paragraph')
markdownRenderer.code = require('./marked-code')

module.exports = string => {
	return string
		? marked(string, { renderer: markdownRenderer })
		: ''
}

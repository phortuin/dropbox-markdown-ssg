const markdownTitle = require('markdown-title')
const markdownDescription = require('markdown-description')
const nunjucksRenderer = require('./nunjucks-renderer')

module.exports = (slug, markdown, template) => {
	let title = markdownTitle(markdown)
	let description = markdownDescription(markdown, { concatLines: true })
	return nunjucksRenderer.render(template, {
		slug,
		markdown,
		title,
		description
	})
}

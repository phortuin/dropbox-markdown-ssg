const { basename } = require('path')
const markdownTitle = require('markdown-title')
const markdownDescription = require('markdown-description')
const nunjucksRenderer = require('./nunjucks-renderer')

module.exports = (path, markdown, template) => {
	let title = markdownTitle(markdown)
	let description = markdownDescription(markdown, { concatLines: true })
	return nunjucksRenderer.render(template, {
		path,
		slug: basename(path),
		markdown,
		title,
		description,
	})
}

const path = require('path')
const slugify = require('slugify')
const markdownToHTML = require('./markdown-to-html')

module.exports = template => {
	return dropboxFile => {
		let parsedPath = path.parse(dropboxFile.path_lower)
		let slug = slugify(parsedPath.name, { lower: true })
		let markdown = dropboxFile.fileBinary.toString('utf8')
		return {
			slug,
			html: markdownToHTML(slug, markdown, template),
		}
	}
}

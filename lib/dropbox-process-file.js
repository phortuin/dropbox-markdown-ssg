const path = require('path')
const slugify = require('slugify')
const markdownToHTML = require('./markdown-to-html')

const TEXT_TYPES = ['.md', '.txt']
const isTextFile = file => TEXT_TYPES.includes(path.extname(file.path_lower))

module.exports = template => {
	return file => {
		if (isTextFile(file)) {
			let parsedPath = path.parse(file.path_lower)
			let slug = slugify(parsedPath.name, { lower: true })
			let fullPath = path.join(`${parsedPath.dir}`, slug, `index.html`)
			if (fullPath === '/index/index.html') {
				fullPath = '/index.html'
			}
			let markdown = file.fileBinary.toString('utf8')
			return {
				path: fullPath,
				content: markdownToHTML(slug, markdown, template),
			}
		} else {
			return {
				path: path.join('media', file.path_lower),
				content: file.fileBinary,
			}
		}
	}
}

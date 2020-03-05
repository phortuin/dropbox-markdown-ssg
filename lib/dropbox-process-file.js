const path = require('path')
const slugify = require('slugify')
const markdownToHTML = require('./markdown-to-html')

const TEXT_TYPES = ['.md', '.txt']
const isTextFile = file => TEXT_TYPES.includes(path.extname(file.path_lower))

function getTargetFolder(dropboxPath) {
	const { name, dir } = path.parse(dropboxPath)
	const slug = slugify(name, { lower: true })
	const folder = path.join(dir, slug)
	return folder === '/index' ? '' : folder
}

module.exports = template => {
	return file => {
		if (isTextFile(file)) {
			const folder = getTargetFolder(file.path_lower)
			const markdown = file.fileBinary.toString('utf8')
			return {
				filename: `${folder}/index.html`,
				content: markdownToHTML(folder, markdown, template),
			}
		} else {
			return {
				filename: path.join('media', file.path_lower),
				content: file.fileBinary,
			}
		}
	}
}

const { basename, join: joinPath } = require('path')
const markdownTitle = require('markdown-title')
const markdownDescription = require('markdown-description')
const contentBlocks = require('markdown-content-blocks')
const nunjucksRenderer = require('./nunjucks-renderer')

const contentStore = require('./content-store')

function getMarkdown(markdown, originalPath, options = {}) {
	let blocks = getContentBlocks(markdown, originalPath, options)
	return contentBlocks(markdown, blocks, options)
}

function getContentBlocks(markdown, originalPath, options) {
	return contentBlocks.getBlocks(markdown)
		.reduce((collection, path) => {
			if (`/${path}` === originalPath) {
				return collection
			}
			let completeBlockski = getMarkdown(contentStore.getContent(path), originalPath, options)
			collection[path] = completeBlockski
			return collection
	}, {})
}

module.exports = (template, binariesTarget) => {
	return file => {
		if (file.binary) { // skip binary files
			return {
				filename: joinPath(file.folder, file.filename),
				content: file.content
			}
		} else {
			let title = markdownTitle(file.content)
			let description = markdownDescription(file.content, { concatLines: true })
			let content = nunjucksRenderer.render(template, {
				path: file.folder,
				slug: basename(file.folder),
				markdown: getMarkdown(file.content, file.filename, { imagePath: `/${binariesTarget}/` }), // iets met die slashes fixen ouwe
				title,
				description,
			})
			return {
				filename: joinPath(file.folder, 'index.html'),
				content,
			}
		}
	}
}

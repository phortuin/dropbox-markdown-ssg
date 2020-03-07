const { basename } = require('path')
const markdownTitle = require('markdown-title')
const markdownDescription = require('markdown-description')
const contentBlocks = require('markdown-content-blocks')
const nunjucksRenderer = require('./nunjucks-renderer')

const options = {
	MARKDOWN_DESCRIPTION: {
		concatLines: true,
	},
	CONTENT_BLOCKS: {
		imagePath: '/media/',
	},
}

module.exports = (path, markdown, template) => {
	let title = markdownTitle(markdown)
	let description = markdownDescription(markdown, options.MARKDOWN_DESCRIPTION)
	return nunjucksRenderer.render(template, {
		path,
		slug: basename(path),
		markdown: contentBlocks(markdown, {}, options.CONTENT_BLOCKS),
		title,
		description,
	})
}

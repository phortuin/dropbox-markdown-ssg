const path = require('path')
const mkdir = require('fs').promises.mkdir
const writeFile = require('fs').promises.writeFile
const slugify = require('slugify')
const contentStore = require('./content-store')
const markdownTitle = require('markdown-title')
const markdownDescription = require('markdown-description')
const contentBlocks = require('markdown-content-blocks')
const nunjucksRenderer = require('./nunjucks-renderer')

function getMarkdown(markdown, originalPath, options = {}) {
	let blocks = getContentBlocks(markdown, originalPath, options)
	return contentBlocks(markdown, blocks, options)
}

function getContentBlocks(markdown, originalPath, options) {
	return contentBlocks.getBlocks(markdown)
		.reduce((collection, _path) => {
			if (`/${_path}` === originalPath) {
				return collection
			}
			let searchPath = path.join(path.dirname(originalPath), _path) // iA possibly supports fully relative paths... good luck with that
			let content = contentStore.getContent(searchPath).content // .content should be a public method returning unprocessed markdown
			let completeBlockski = getMarkdown(content, originalPath, options)
			collection[_path] = completeBlockski
			return collection
	}, {})
}

function getFolder(originalPath) {
	const { name, dir } = path.parse(originalPath)
	const slug = slugify(name, { lower: true })
	const folder = path.join(dir, slug)
	return folder === '/index' ? '' : folder
}

class Content {
	constructor(content) {
		this.content = content
	}
}

class BinaryContent extends Content {
	getContent() {
		return this.content
	}
}

class TextContent extends Content {
	constructor(content, originalPath, template, assetsFolder, folder) {
		super(content)
		this.originalPath = originalPath
		this.template = template
		this.assetsFolder = assetsFolder
		this.folder = folder
		this._storeContent(originalPath)
	}

	getContent() {
		return this._getMarkdown()
	}

	_getMarkdown() {
		const assetsTarget = path.sep.concat(path.join(this.assetsFolder, path.dirname(this.originalPath)))
		const markdown = getMarkdown(this.content, this.originalPath, { imagePath: assetsTarget })
		const title = markdownTitle(markdown)
		const description = markdownDescription(markdown, { concatLines: true })
		const siblings = contentStore.find(path.dirname(this.folder))
		return nunjucksRenderer.render(this.template, {
			markdown,
			title,
			description,
			path: this.folder,
			slug: path.basename(this.folder),
			siblings,
		})
	}

	_getFolder() {
		return getFolder(this.originalPath)
	}

	_storeContent(originalPath) {
		contentStore.setContent(originalPath, this)
	}
}

class DropboxFile {
	constructor(file, { template, buildFolder, assetsFolder }) {
		this.originalPath = file.path_lower
		this.template = template
		this.assetsFolder = assetsFolder
		this._setTarget(buildFolder, assetsFolder)
		this._setContent(file.fileBinary, template)
	}

	writeToTarget() {
		return mkdir(path.dirname(this.target), { recursive: true })
			.then(() => writeFile(this.target, this._getContent()))
			.then(() => this.target)
	}

	_setTarget(buildFolder, assetsFolder) {
		if (this._isText()) {
			this.target = path.join(buildFolder, this._getFolder(), 'index.html')
		} else {
			this.target = path.join(buildFolder, assetsFolder, this.originalPath)
		}
	}

	_setContent(binaryContent, template) {
		if (this._isText()) {
			this.content = new TextContent(
				binaryContent.toString('utf8'),
				this.originalPath,
				template,
				this.assetsFolder,
				this._getFolder()
			)
		} else {
			this.content = new BinaryContent(binaryContent)
		}
	}

	_isText() {
		return ['.md', '.txt'].includes(path.extname(this.originalPath))
	}

	_getFolder() {
		return getFolder(this.originalPath)
	}

	_getContent() {
		return this.content.getContent()
	}
}

module.exports = { DropboxFile }

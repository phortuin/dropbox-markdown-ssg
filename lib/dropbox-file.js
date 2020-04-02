const path = require('path')
const mkdir = require('fs').promises.mkdir
const writeFile = require('fs').promises.writeFile
const slugify = require('slugify')
const contentStore = require('./content-store')

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
	constructor(content, originalPath, template) {
		super(content)
		this.template = template
		this._storeContent(originalPath)
	}

	getContent() {
		return this.content // something html
	}

	_storeContent(originalPath) {
		contentStore.setContent(originalPath, this.content)
	}
}

class DropboxFile {
	constructor(file, { template, buildFolder, assetsFolder }) {
		this.originalPath = file.path_lower
		this.template = template
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
				template
			)
		} else {
			this.content = new BinaryContent(binaryContent)
		}
	}

	_isText() {
		return ['.md', '.txt'].includes(path.extname(this.originalPath))
	}

	_getFolder() {
		const { name, dir } = path.parse(this.originalPath)
		const slug = slugify(name, { lower: true })
		const folder = path.join(dir, slug)
		return folder === '/index' ? '' : folder
	}

	_getContent() {
		return this.content.getContent()
	}
}

module.exports = { DropboxFile }

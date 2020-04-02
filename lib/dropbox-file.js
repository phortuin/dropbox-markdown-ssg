const path = require('path')
const mkdir = require('fs').promises.mkdir
const writeFile = require('fs').promises.writeFile
const slugify = require('slugify')
const contentStore = require('./content-store')

class DropboxFile {
	constructor(file, { template, buildFolder, assetsFolder }) {
		this.originalPath = file.path_lower
		this.content = this._getContent(file.fileBinary)
		this.target = this._getTarget(buildFolder, assetsFolder)
		this.template = template
		this._storeContent()
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

	_getTarget(buildFolder, assetsFolder) {
		if (this._isText()) {
			return path.join(buildFolder, this._getFolder(), 'index.html')
		} else {
			return path.join(buildFolder, assetsFolder, this.originalPath)
		}
	}

	_getContent(binaryData) {
		if (this._isText()) {
			return binaryData.toString('utf8') // en dan nog de markdown he
		} else {
			return binaryData
		}
	}

	_storeContent() {
		if (this._isText()) {
			contentStore.setContent(this.originalPath, this.content)
		}
	}

	writeToTarget() {
		return mkdir(path.dirname(this.target), { recursive: true })
			.then(() => writeFile(this.target, this.content))
			.then(() => this.target)
	}
}

module.exports = { DropboxFile }

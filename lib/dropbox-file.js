const path = require('path')
const mkdir = require('fs').promises.mkdir
const writeFile = require('fs').promises.writeFile
const slugify = require('slugify')
const store = require('./store')
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
			let file = store.getFile(searchPath)
			if (file) {
				let content = file.getRawContent()
				let contentBlock = getMarkdown(content, originalPath, options) // recursion happens here
				collection[_path] = contentBlock
			}
			return collection
	}, {})
}

class DropboxFile {
	constructor(file, { template, buildFolder, assetsFolder }) {
		this.originalPath = file.path_lower
		this.template = template
		this.assetsFolder = assetsFolder
		this.modifiedDate = file.client_modified
		this._setTarget(buildFolder, assetsFolder)
		this._setContent(file.fileBinary, template)
		this._storeFile()
	}

	get sortBy() {
		return this.originalPath
	}

	writeToTarget() {
		return mkdir(path.dirname(this.target), { recursive: true })
			.then(() => writeFile(this.target, this.getContent()))
			.then(() => this.target)
	}

	getParent() {
		const folder = path.dirname(this.originalPath)
		if (folder === path.sep) {
			return
		} else {
			const parentPath = `${folder}.md`
			return store.getFile(parentPath)
		}
	}

	getChildren() {
		const childPath = path.join(path.dirname(this.originalPath), path.basename(this.originalPath, '.md'))
		const childPathRegex = `${childPath}\/[^\\s\/]+\.md` // only direct children; no / allowed
		return store.getFiles(new RegExp(childPathRegex, 'i'))
	}

	getRawContent() {
		return this.content
	}

	getContent() {
		if (this._isText()) {
			return this._getHTML()
		} else {
			return this.content
		}
	}

	toSimpleProps() {
		const assetsTarget = path.sep.concat(path.join(this.assetsFolder, path.dirname(this.originalPath)))
		const markdown = getMarkdown(this.content, this.originalPath, { imagePath: assetsTarget })
		const folder = this._getFolder()
		return {
			title: markdownTitle(markdown),
			path: folder,
			slug: path.basename(folder), // of this.slug, gewoon
		}
	}

	toProps() {
		const assetsTarget = path.sep.concat(path.join(this.assetsFolder, path.dirname(this.originalPath)))
		const markdown = getMarkdown(this.content, this.originalPath, { imagePath: assetsTarget })
		const parent = this.getParent(this.originalPath) // nunjucks doet object.keys(obj) dus _of_ je this.bla is allemaal dik in orde, _of_ call gewoon myobj.toJSON() of zo
		const folder = this._getFolder()

		// optie om siblings zonder huidige page te tonen?
		// of is dat template logic
		const siblings = parent
			? parent.getChildren().map(file => file.toSimpleProps())
			: {}
		return {
			markdown,
			title: markdownTitle(markdown),
			description: markdownDescription(markdown, { concatLines: true }),
			path: folder,
			slug: path.basename(folder), // of this.slug, gewoon
			siblings,
			parent: parent ? parent.toProps() : {},
			children: this.getChildren().map(file => file.toSimpleProps()),
			originalPath: this.originalPath,
			modifiedDate: this.modifiedDate,
		}
	}

	_storeFile() {
		store.setFile(this.originalPath, this)
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
			this.content = binaryContent.toString('utf8')
		} else {
			this.content = binaryContent
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

	_getHTML() {
		return nunjucksRenderer.render(this.template, this.toProps())
	}
}

module.exports = { DropboxFile }

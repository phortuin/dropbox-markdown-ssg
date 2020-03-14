const path = require('path')
const slugify = require('slugify')
const contentStore = require('./content-store')

const TEXT_TYPES = ['.md', '.txt']
const isTextFile = file => TEXT_TYPES.includes(path.extname(file.path_lower))

function getTargetFolder(dropboxPath) {
	const { name, dir } = path.parse(dropboxPath)
	const slug = slugify(name, { lower: true })
	const folder = path.join(dir, slug)
	return folder === '/index' ? '' : folder
}

module.exports = binariesTarget => {
	return file => {
		const filename = file.path_lower
		let binary, folder, content
		if (isTextFile(file)) {
			binary = false
			folder = getTargetFolder(filename)
			content = file.fileBinary.toString('utf8')
			// store this markdown content in content store
			// so we can pick it up during rendering w/ content blocks
			contentStore.setContent(filename, content)
		} else {
			binary = true
			folder = binariesTarget
			content = file.fileBinary
		}
		return {
			binary,
			folder,
			filename,
			content,
		}
	}
}

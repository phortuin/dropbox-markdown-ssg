const getDropboxFiles = require('./lib/dropbox-get-files')
const contentStore = require('./lib/content-store')
const markdownToHTML = require('./lib/markdown-to-html')
const writeToTarget = require('./lib/file-write-to-target')

const DEFAULTS = {
	template: 'index.njk',
	target: 'build',
	binariesTarget: 'media',
}

const INVALID_OR_MISSING_TOKEN = 'Dropbox token seems missing or invalid'

function validToken(token) {
	return /^[a-zA-Z0-9_-]{64}$/.test(token)
}

function storeMarkdown(dropboxFile) {
	if (file.is_text) {
		try {
			const markdown = file.fileBinary.toString('utf8')
			contentStore.setContent(file.path_lower, markdown)
		} catch(error) {
			console.error(error)
		}
	}
	return file
}

const create = () => {

	function dmssg(token, options) {
		options = Object.assign({}, DEFAULTS, options)
		token || (token = process.env.DROPBOX_TOKEN)
		if (!validToken(token)) {
			throw new Error(INVALID_OR_MISSING_TOKEN)
		}
		return startTheThing(token, options)
	}


	function startTheThing(token, options) {
		return getDropboxFiles(token)
			.map(storeMarkdown)
			.map(markdownToHTML(options.template, options.binariesTarget))
			.map(writeToTarget(options.target))
	}

	return dmssg

}

module.exports = create()

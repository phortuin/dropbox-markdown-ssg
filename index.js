const getDropboxFiles = require('./lib/dropbox-get-files')
const processDropboxFile = require('./lib/dropbox-process-file')
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
			.map(processDropboxFile(options.binariesTarget))
			.map(writeToTarget(options.target))
	}

	return dmssg

}

module.exports = create()

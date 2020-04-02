const getDropboxFiles = require('./lib/dropbox-get-files')

const DEFAULTS = {
	template: 'index.njk',
	buildFolder: 'build',
	assetsFolder: 'assets',
}

function validToken(token) {
	return /^[a-zA-Z0-9_-]{64}$/.test(token)
}

function dmssg(token, options) {
	options = Object.assign({}, DEFAULTS, options)
	token || (token = process.env.DROPBOX_TOKEN)
	if (!validToken(token)) {
		throw new Error('Dropbox token seems missing or invalid')
	}
	return getDropboxFiles(token, options)
		.map(file => file.writeToTarget())
}

module.exports = dmssg

const fetch = require('node-fetch')
const Dropbox = require('dropbox').Dropbox
const DropboxFile = require('./dropbox-file').DropboxFile

fetch.Promise = require('bluebird')

module.exports = (accessToken, options) => {
	const dropboxApi = new Dropbox({
		fetch,
		accessToken
	})

	return dropboxApi.filesListFolder({ path: '', recursive: true })
		.then(response => response.entries)
		.filter(entry => entry.is_downloadable)
		.map(file => dropboxApi.filesDownload({ path: file.path_lower }))
		.map(file => new DropboxFile(file, options))
}

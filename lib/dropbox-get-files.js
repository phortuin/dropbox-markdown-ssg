const Dropbox = require('dropbox').Dropbox
const fetch = require('node-fetch')
fetch.Promise = require('bluebird')

module.exports = accessToken => {
	const dropboxApi = new Dropbox({
		fetch,
		accessToken
	})

	return dropboxApi.filesListFolder({ path: '', recursive: true })
		.then(response => response.entries)
		.filter(entry => entry.is_downloadable)
		.map(file => dropboxApi.filesDownload({ path: file.path_lower }))
}

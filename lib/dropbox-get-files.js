const Dropbox = require('dropbox').Dropbox
const fetch = require('node-fetch')
fetch.Promise = require('bluebird')


module.exports = accessToken => {
	const onlyFiles = entry => entry['.tag'] !== 'folder'
	const dropboxApi = new Dropbox({
		fetch,
		accessToken
	})

	return dropboxApi.filesListFolder({ path: '', recursive: true })
		.then(response => response.entries.filter(onlyFiles))
		.map(file => dropboxApi.filesDownload({ path: file.path_lower }))
}

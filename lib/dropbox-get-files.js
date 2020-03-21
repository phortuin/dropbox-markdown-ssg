const path = require('path')
const fetch = require('node-fetch')
const Dropbox = require('dropbox').Dropbox
fetch.Promise = require('bluebird')

const TEXT_TYPES = ['.md', '.txt']

const setIsText = file => {
	file.is_text = TEXT_TYPES.includes(path.extname(file.path_lower))
	return file
}

module.exports = accessToken => {
	const dropboxApi = new Dropbox({
		fetch,
		accessToken
	})

	return dropboxApi.filesListFolder({ path: '', recursive: true })
		.then(response => response.entries)
		.filter(entry => entry.is_downloadable)
		.map(file => dropboxApi.filesDownload({ path: file.path_lower }))
		.map(setIsText)
}

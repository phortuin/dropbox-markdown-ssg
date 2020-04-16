let files = {}

module.exports = {
	setFile(path, dropboxFile) {
		files[path] = dropboxFile
	},
	getFile(path) {
		return files[path]
	},
	getFiles(regex) {
		return Object.keys(files).reduce((collection, path) => {
			if (regex.test(path)) {
				collection.push(files[path])
			}
			return collection
		}, []).sort((a, b) => {
			return a.sortBy > b.sortBy ? 1 : -1
		})
	}
}

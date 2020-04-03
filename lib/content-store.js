const markdownTitle = require('markdown-title')

let content = {}

function sanitisePath(path) {
	if (path.startsWith('/')) {
		path = path.slice(1)
	}
	return path
}

module.exports = {
	setContent(path, dropboxFile) {
		path = sanitisePath(path)
		content[path] = dropboxFile
	},
	getContent(path) {
		path = sanitisePath(path)
		return content[path]
	},
	find(string) {
		string = sanitisePath(string)
		if (!string || string === '' || string === '.') {
			return []
		}
		const regex = new RegExp(string, 'i')
		return Object.keys(content).reduce((collection, path) => {
			if (regex.test(path)) {
				let dropboxFile = content[path]
				collection.push({
					title: markdownTitle(dropboxFile.content),
					path: dropboxFile._getFolder(),
				})
			}
			return collection
		}, [])
	},
}

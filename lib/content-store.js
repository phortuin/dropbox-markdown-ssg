let content = {}

function sanitisePath(path) {
	if (path.startsWith('/')) {
		path = path.slice(1)
	}
	return path
}

module.exports = {
	setContent(path, markdown) {
		path = sanitisePath(path)
		content[path] = markdown
	},
	getContent(path) {
		return content[path]
	}
}

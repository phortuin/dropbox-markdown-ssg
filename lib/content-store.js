let content = {}

module.exports = {
	setContent(path, markdown) {
		if (path.startsWith('/')) {
			path = path.slice(1)
		}
		content[path] = markdown
	},
	getContent(path) {
		return content[path]
	}
}

const path = require('path')
const promisify = require('bluebird').promisify
const mkdir = require('fs').promises.mkdir
const writeFile = promisify(require('fs').writeFile)

module.exports = target => {
	return ({ path: filePath, content }) => {
		const fullPath = path.join(target, filePath)
		return mkdir(path.dirname(fullPath), { recursive: true })
			.then(() => writeFile(fullPath, content))
			.then(() => fullPath)
	}
}

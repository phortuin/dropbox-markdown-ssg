const { join: joinPath, dirname } = require('path')
const mkdir = require('fs').promises.mkdir
const writeFile = require('fs').promises.writeFile

module.exports = target => {
	return ({ filename, content }) => {
		const path = joinPath(target, filename)
		return mkdir(dirname(path), { recursive: true })
			.then(() => writeFile(path, content))
			.then(() => path)
	}
}

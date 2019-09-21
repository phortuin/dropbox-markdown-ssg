const nunjucks = require('nunjucks')

const loader = new nunjucks.FileSystemLoader('', {
	noCache: true,
	watch: false
})

const templateRenderer = new nunjucks.Environment(loader)
templateRenderer.addFilter('markdown', require('./nunjucks-filter-markdown'))

module.exports = templateRenderer

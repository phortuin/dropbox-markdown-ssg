const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const fileName = 'My Amazing File.md'
const filePath = `/${fileName}`
const fileContents = `
# Amazing

It actually works
`
const fileHTML = `
<h1>Amazing</h1>
<p>It actually works</p>
`
const template = 'template.html'

const dropboxFileFromFilesListFolder = {
    ".tag": "file",
    name: fileName,
    path_lower: filePath,
    path_display: filePath,
    id: "id:jnpK30p6l5sAAAAAAAABcf",
    client_modified: "2019-01-01T00:00:00Z",
    server_modified: "2019-01-01T00:01:00Z",
    rev: "5947f060c0e790ed9185a",
    size: 5,
    is_downloadable: true,
    content_hash: "0cceb9870873a1a3a404ab3d8d96c5787effaea64a490b7a5139aa85a7ea8146"
}

const dropboxFileFromFilesDownload = {
	name: fileName,
	path_lower: filePath,
	path_display: filePath,
	id: "id:jnpK30p6l5sAAAAAAAABcf",
	client_modified: "2019-01-01T00:00:00Z",
	server_modified: "2019-01-01T00:01:00Z",
	rev: "5947f060c0e790ed9185a",
	size: 5,
	is_downloadable: true,
	content_hash: "0cceb9870873a1a3a404ab3d8d96c5787effaea64a490b7a5139aa85a7ea8146",
	fileBinary: Buffer.from(fileContents)
}

test('Dropbox file to HTML returns slugified filename', t => {
	const dropboxFileToHTML = proxyquire('./lib/dropbox-file-to-html', {
		'./markdown-to-html': () => fileHTML
	})
	let result = dropboxFileToHTML(template)(dropboxFileFromFilesDownload)
	t.plan(1)
	t.equal(result.slug, 'my-amazing-file')
})


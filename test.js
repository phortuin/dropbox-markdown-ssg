const test = require('tape')
const sinon = require('sinon')
const { DropboxFile } = require('./lib/dropbox-file')

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

const options = {
	template,
	buildFolder: 'build',
	assetsFolder: 'assets',
}

test('Dropbox file has slug and html', t => {
	let file = new DropboxFile(dropboxFileFromFilesDownload, options)
	sinon.stub(file, '_getHTML').returns(fileHTML)
	let fileProps = file.toProps()
	t.plan(2)
	t.equal(fileProps.slug, 'my-amazing-file')
	t.equal(file.getContent(), fileHTML) // pretty useless test, tho
})

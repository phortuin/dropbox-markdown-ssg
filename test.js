const test = require('tape')
const sinon = require('sinon')
const nunjucksRenderer = require('./lib/nunjucks-renderer')
const { DropboxFile } = require('./lib/dropbox-file')

// File 1

const file1Name = 'File One.md'
const file1Path = `/${file1Name}`
const file1Contents = `
# Amazing

It actually works
`
const file1HTML = `<h1 id="amazing">Amazing</h1>
<p>It actually works</p>`

const file1ContentsWithContentBlock = `
# Amazing

/A Child.md
`
const file1HTMLWithContentBlock = `<h1 id="amazing">Amazing</h1>
<h2 id="this-is-from-a-child">This is from a child</h2>
`

const file1FromDropbox = {
	name: file1Name,
	path_lower: file1Path.toLowerCase(),
	path_display: file1Path,
	id: "id:jnpK30p6l5sAAAAAAAABcf",
	client_modified: "2019-01-01T00:00:00Z",
	server_modified: "2019-01-01T00:01:00Z",
	rev: "5947f060c0e790ed9185a",
	size: 5,
	is_downloadable: true,
	content_hash: "0cceb9870873a1a3a404ab3d8d96c5787effaea64a490b7a5139aa85a7ea8146",
	fileBinary: Buffer.from(file1Contents)
}

const file1WithContentBlockFromDropbox = {
	name: file1Name,
	path_lower: file1Path.toLowerCase(),
	path_display: file1Path,
	id: "id:jnpK30p6l5sAAAAAAAABcf",
	client_modified: "2019-01-01T00:00:00Z",
	server_modified: "2019-01-01T00:01:00Z",
	rev: "5947f060c0e790ed9185a",
	size: 5,
	is_downloadable: true,
	content_hash: "0cceb9870873a1a3a404ab3d8d96c5787effaea64a490b7a5139aa85a7ea8146",
	fileBinary: Buffer.from(file1ContentsWithContentBlock)
}

// File 2

const file2Name = 'A Child.md'
const file2Path = `/${file2Name}`
const file2Contents = `
## This is from a child
`

const file2FromDropbox = {
    ".tag": "file",
    name: file2Name,
    path_lower: file2Path.toLowerCase(),
    path_display: file2Path,
    id: "id:jnpK30p6l5sAAAAAAAABcf",
    client_modified: "2019-01-01T00:00:00Z",
    server_modified: "2019-01-01T00:01:00Z",
    rev: "5947f060c0e790ed9185a",
    size: 5,
    is_downloadable: true,
    content_hash: "0cceb9870873a1a3a404ab3d8d96c5787effaea64a490b7a5139aa85a7ea8146",
    fileBinary: Buffer.from(file2Contents)
}

const options = {
	template: '',
	buildFolder: 'build',
	assetsFolder: 'assets',
}

function _getHTMLFake(file) {
	return nunjucksRenderer.renderString("{{ markdown | markdown | safe }}", file.toProps())
}

// Test cases

test('Dropbox file has slug and correct html', t => {
	t.plan(2)
	let file = new DropboxFile(file1FromDropbox, options)
	sinon.stub(file, '_getHTML').callsFake(() => { return _getHTMLFake(file) })
	t.equal(file.toProps().slug, 'file-one')
	t.equal(file.getContent(), file1HTML)
})

// Test that covers bugfix in 1.4.1
// where content block that had a case mismatch with file.path_lower
// would not be found in lib/store.js nor rendered in HTML
// (ex: content block `/Stuff.md` would not match the file `stuff.md`)
test('Matching of files with content blocks is case insensitive', t => {
	t.plan(1)
	let file = new DropboxFile(file1WithContentBlockFromDropbox, options)
	let file2 = new DropboxFile(file2FromDropbox, options)
	sinon.stub(file, '_getHTML').callsFake(() => { return _getHTMLFake(file) })
	t.equal(file.getContent(), file1HTMLWithContentBlock)
})

module.exports = (href, title, text) => `
	<figure>
		<img src="${href}" alt="${text}">${ title ? `
		<figcaption>${title}</figcaption>` : '' }
	</figure>
`

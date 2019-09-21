const prism = require('prismjs')

module.exports = (code, language) => {
	language = !language || language === 'html' ? 'markup' : language
	if (!prism.languages.hasOwnProperty(language)) {
		require(`prismjs/components/prism-${language}.js`)
	}
	return `
		<pre class="language-${language}">
			<code>${ prism.highlight(code, prism.languages[language]) }</code>
		</pre>
	`
}

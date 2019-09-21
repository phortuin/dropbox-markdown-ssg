module.exports = text => {
	return text.trim().startsWith('<figure') ? text : `<p>${text}</p>`
}

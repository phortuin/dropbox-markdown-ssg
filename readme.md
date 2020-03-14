# Dropbox Markdown SSG

> Turns a Dropbox folder with Markdown files into a static site

This package downloads files from Dropbox, converts Markdown to HTML and writes to a target folder with `folder/index.html` structure. Any downloadable file (like images and other media) get stored in `<target>/media`. Supports content blocks.

## API

Returns array of written paths

### options

template, target, binariesTarget

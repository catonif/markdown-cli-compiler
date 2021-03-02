# Hello (c)
I really like this
- oh damn
    * is this another thing?

1. ols are the best
2. ikr?

```ts
const md = require('markdown-it')({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value ' </code></pre>';
			} catch { }
		}
		return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) '</code></pre>';
	}
});
```

**yo i'm bold** *yo i'm italic* ***yo i'm both***

==MARK TEST==

$\sqrt{3x-1}+(1+x)^2$

^sup^ ~sub~ [[kbd]]

:eye::lips::eye:

Term 1

:   Definition 1

Term 2 with *inline markup*

:   Definition 2

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
The HTML specification
is maintained by the W3C.

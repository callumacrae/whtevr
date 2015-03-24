# whtevr

> The lazy loading library that just doesn't care.

whtevr is a lazy loading library that can lazily load anything. I designed it
so that I could use it with srcset and picturefill. You can probably put other
stuff like videos in it, too. Whatever. I don't care. Neither does this
library.

It relies on jQuery and another library of mine, [when-scroll].

The build is probably failing right now, it seems to be [an issue with
mocha-phantomjs][mocha-phantomjs issue]. Here it is:

## Installation

```
$ npm install --save whtevr
```

## Usage

Put everything in a script tag with the type "text/x-whtevr":

```html
<script type="text/x-whtevr">
	<img src="..." srcset="...">
</script>
```

An event will be fired when it is loaded:

```js
$('[type="text/x-whtevr"]').on('whtevr-loaded', function (e, $el) {
	picturefill({
		elements: $el.toArray()
	});
});
```

## License

Released under the MIT license.

[mocha-phantomjs issue]: https://github.com/metaskills/mocha-phantomjs/issues/168
[when-scroll]: https://github.com/callumacrae/when-scroll
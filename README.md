# whtevr [![Build Status](https://travis-ci.org/callumacrae/whtevr.svg)](https://travis-ci.org/callumacrae/whtevr)

> The lazy loading library that just doesn't care.

whtevr is a lazy loading library that can lazily load anything. I designed it
so that I could use it with srcset and picturefill. You can probably put other
stuff like videos in it, too. Whatever. I don't care. Neither does this
library.

It relies on jQuery and another library of mine, [when-scroll].

## Installation

```
$ npm install --save whtevr
```

Require `whtevr` if you're using babelify. Require `whtevr/build` if you're not.

## Usage

Put everything in a noscript tag with the class "js-whtevr":

```html
<noscript class="js-whtevr">
	<img src="..." srcset="...">
</noscript>
```

It will load the contents of the script tag when it is 300px away from the
bottom of the screen.

You can also use it to defer the loading of stuff until after the page has
loaded, using the `data-load-after` attribute. It doesn't matter where it is:
if you specify this attribute, it will be loaded after that amount of time.

An event will be fired when it is loaded:

```js
$('.js-whtevr').on('whtevr-loaded', function (e, $el) {
	picturefill({
		elements: $el.toArray()
	});
});
```

### legacy

Prior to 0.2 (and this still works), you had to use a script tag:

> Put everything in a script tag with the type "text/x-whtevr":
>
> ```html
> <script type="text/x-whtevr">
> 	<img src="..." srcset="...">
> </script>
> ```
>
> It will load the contents of the script tag when it is 300px away from the
> bottom of the screen.
>
> You can also use it to defer the loading of stuff until after the page has
> loaded, using the `data-load-after` attribute. It doesn't matter where it is:
> if you specify this attribute, it will be loaded after that amount of time.
>
> An event will be fired when it is loaded:
>
> ```js
> $('[type="text/x-whtevr"]').on('whtevr-loaded', function (e, $el) {
> 	picturefill({
> 		elements: $el.toArray()
> 	});
> });
> ```

As of 0.2, you can use noscript tags to lazy load stuff. It works without
JavaScript, and it means your editor will syntax highlight the contents.

## License

Released under the MIT license.

[mocha-phantomjs issue]: https://github.com/metaskills/mocha-phantomjs/issues/168
[when-scroll]: https://github.com/callumacrae/when-scroll

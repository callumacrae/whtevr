(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery', 'when-scroll'], factory);
	} else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
		// CommonJS
		factory(exports, require('jquery'), require('when-scroll'));
	} else {
		// Browser globals
		factory(root, root.jQuery, root.whenScroll);
	}
}(this, function (exports, $, whenScroll) {


'use strict';

/**
 * Removes the hidden whtevr element from the DOM, and unwraps the loaded
 * content from the temporary <div> element.
 *
 * @param {jQuery} $scriptTag The whtevr element housing the hidden content
 * @param {jQuery} $placeholder The <div> tag created for the bounding rect
 */
function cleanUp($scriptTag, $placeholder) {
	$scriptTag.remove();
	$placeholder.children().unwrap();
}

/**
 * Loads the contents of the whtevr element.
 *
 * Takes the content within the whtevr element, and outputs it to a temporary
 * <div> element created earlier. Also checks for images, and fires an event
 * when all images have been loaded.
 *
 * @param {jQuery} $scriptTag The whtevr element housing the hidden content
 */
function loadNow($scriptTag) {
	var $placeholder = $scriptTag.next('.whtevr-helper');
	var isNoscript = ($scriptTag.prop('tagName') === 'NOSCRIPT');
	var $content = isNoscript ? $scriptTag.text() : $scriptTag.html();
	$placeholder.html($content);

	$scriptTag.trigger('whtevr-loaded', [ $placeholder ]);

	// We add an additional parameter to see whether we should remove the DOM
	// element in the triggerFinished function, as we don't want to remove the
	// element if we have images to load, as the `whtevr-images-loaded` trigger
	// may not have an element to fire on if it's been removed here.
	var $images = $placeholder.find('img');
	if ($images.length > 0) {
		var promises = $images.map(function (i, img) {
			var promise = $.Deferred();
			$(img).on('load', function () {
				promise.resolve();
			});
			return promise;
		}).toArray();

		$.when.apply($, promises).then(function () {
			$scriptTag.trigger('whtevr-images-loaded', [ $placeholder ]);
			cleanUp($scriptTag, $placeholder);
		});
	} else {
		cleanUp($scriptTag, $placeholder);
	}
}

$.fn.whtevrInit = function () {
	return this.each(function () {
		var $this = $(this);
		// We create this now because script tags don't have a bounding rect
		var $placeholder = $('<div class="whtevr-helper" />');
		$placeholder
				.css('display', 'inline')
				.insertAfter($this);
		// data-load-after to load the element after an interval of time
		if ($this.data('load-after')) {
			$(window).on('load', function () {
				setTimeout(function () {
					loadNow($this);
				}, $this.data('load-after'));
			});
		} else {
			whenScroll(['within 300px of', $placeholder[0]], function () {
				loadNow($this);
			}, true);
		}
	});
};

$('[type="text/x-whtevr"], .js-whtevr').whtevrInit();

/**
 * jQuery plugin to immediately load the contents of a whtevr element.
 *
 * @return {jQuery} Self.
 */
$.fn.whtevrLoad = function () {
	return this.each(function () {
		loadNow($(this));
	});
};



}));

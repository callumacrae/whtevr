(function (root, factory) {
	if (typeof exports === 'object') {
		factory(require('jquery'), require('when-scroll'));
	} else {
		factory(root.$, root.whenScroll);
	}
}(this, function ($, whenScroll) {

	var $window = $(window);

	$('[type="text/x-whtevr"], .js-whtevr').each(function () {
		var $this = $(this);

		// We create this now because script tags don't have a bounding rect
		var $newElement = $('<div />');
		$newElement.insertAfter($this);

		$this.data('whtevrNewElement', $newElement);

		function loadNow() {
			load($this);
		}

		if ($this.data('load-after')) {
			$window.on('load', function () {
				setTimeout(loadNow, $this.data('load-after'));
			});
		} else {
			whenScroll(['within 300px of', $newElement[0]], loadNow, true);
		}
	});

	$.fn.whtevrLoad = function () {
		this.each(function () {
			load($(this));
		});
	};

	function load($element) {
		var $newElement = $element.data('whtevrNewElement');

		var isNoscript = ($this.prop('tagName') === 'NOSCRIPT');
		$newElement.html(isNoscript ? $element.text() : $element.html());

		$element
			.trigger('whtevr-loaded', [ $newElement ])
			.remove();
	}
}));
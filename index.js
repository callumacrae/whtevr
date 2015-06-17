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

		function loadNow() {
			var isNoscript = ($this.prop('tagName') === 'NOSCRIPT');
			$newElement.html(isNoscript ? $this.text() : $this.html());

			$this
				.trigger('whtevr-loaded', [ $newElement ])
				.remove();
		}

		if ($this.data('load-after')) {
			$window.on('load', function () {
				setTimeout(loadNow, $this.data('load-after'));
			});
		} else {
			whenScroll(['within 300px of', $newElement[0]], loadNow, true);
		}
	});
}));
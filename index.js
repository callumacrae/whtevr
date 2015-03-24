(function (root, factory) {
	if (typeof exports === 'object') {
		factory(require('jquery'), require('when-scroll'));
	} else {
		factory(root.$, root.whenScroll);
	}
}(this, function ($, whenScroll) {

	$('[type="text/x-whtevr"]').each(function () {
		var $this = $(this);

		// We create this now because script tags don't have a bounding rect
		var $newElement = $('<div />');
		$newElement.insertAfter($this);

		whenScroll(['within 300px of', $newElement[0]], function () {
			$newElement.html($this.html());

			$this
				.trigger('whtevr-loaded', [ $newElement ])
				.remove();
		});
	});

	// Ensure visible elements are loaded immediately
	$(window).trigger('scroll');

}));
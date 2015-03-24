'use strict';

describe('whtevr', function () {
	var eventFired = false;
	var $element;

	before(function () {
		$('[type="text/x-whtevr"]').on('whtevr-loaded', function (e, $el) {
			eventFired = true;
			$element = $el;
		});
	});

	after(function () {
		$(window).scrollTop(0);
		$('.deletewhendone').remove();
	});

	it('should not load stuff early', function () {
		$('#test').length.should.equal(0);
	});

	it('should load stuff', function (done) {
		$(window).scrollTop(1700);

		var interval = setInterval(function () {
			if ($('#test').length === 1) {
				done();
				clearInterval(interval);
			}
		}, 10);
	});

	it('should have fired an event', function () {
		eventFired.should.be.True;
		$element.length.should.equal(1);
		$element.is(':visible').should.be.True;
	});
});

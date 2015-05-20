'use strict';

describe('whtevr', function () {
	after(function () {
		$(window).scrollTop(0);
		$('.deletewhendone').remove();
	});

	describe('lazy load on delay', function () {
		it('should not load stuff early', function () {
			$('#test2').length.should.equal(0);
		});

		it('should load stuff after a bit tho', function (done) {
			$(document).ready(function () {
				setTimeout(function () {
					$('#test2').length.should.equal(1);
					done();
				}, 11);
			});
		});
	});

	describe('lazy load on scroll', function () {
		var eventFired = false;
		var $element;

		before(function () {
			$('[type="text/x-whtevr"]').on('whtevr-loaded', function (e, $el) {
				eventFired = true;
				$element = $el;
			});
		});

		it('should not load stuff early', function () {
			$('#test').length.should.equal(0);
		});

		it('should load stuff', function (done) {
			setTimeout(function () {
				$(window).scrollTop(1700);
			});

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
});
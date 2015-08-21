/* global $ */
'use strict';

describe('whtevr', function () {
  after(function () {
    $(window).scrollTop(0);
    $('.deletewhendone').remove();
  });

  describe('non-lazy loading', function () {
    it('should load immediately if on screen', function () {
      $('#test3').length.should.equal(1);
    });
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
        }, 150);
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
      $('[type="text/x-whtevr-experiment"]').whtevrLoad();
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

    it('should show content on event', function () {
      $('#test-fn-1').length.should.equal(1);
    });

    it('should have fired an event', function () {
      eventFired.should.be.True;
      $element.length.should.equal(1);
      //Commenting this out because I'm removing the wrapping <div> when
      //$element.is(':visible').should.be.True;
    });
  });

  describe('noscript', function () {
    var eventFired = false;
    var $element;

    before(function () {
      $('.js-whtevr').on('whtevr-loaded', function (e, $el) {
        eventFired = true;
        $element = $el;
      });
    });

    it('should not load stuff early', function () {
      $('#test4').length.should.equal(0);
    });

    it('should load stuff', function (done) {
      setTimeout(function () {
        $(window).scrollTop(8700);
      });

      var interval = setInterval(function () {
        if ($('#test4').length === 1) {
          done();
          clearInterval(interval);
        }
      }, 10);
    });

    it('should have fired an event', function () {
      eventFired.should.be.True;
      $element.length.should.equal(1);
      // Commenting this out because I'm removing the wrapping <div> when
      //$element.is(':visible').should.be.True;
    });
  });
});
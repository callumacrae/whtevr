(function (root, factory) {
  if (typeof exports === 'object') {
    factory(require('jquery'), require('when-scroll'));
  } else {
    factory(root.$, root.whenScroll);
  }
}(this, function ($, whenScroll) {

  var $window = $(window);

  function triggerFinished($scriptTag, $tmpElement) {
    $scriptTag
      .trigger('whtevr-loaded', [ $tmpElement ])
      .remove();
    $tmpElement.children().unwrap();
  }

  function loadNow($scriptTag, $tmpElement) {
    var isNoscript = ($scriptTag.prop('tagName') === 'NOSCRIPT');
    var $content = isNoscript ? $scriptTag.text() : $scriptTag.html();
    $tmpElement.html($.parseHTML($content));
    var $images = $tmpElement.find('img');
    var imageTicker = 0;
    var imageCount = $images.length;
    if (imageCount > 0) {
      $images.load(function () {
        ++imageTicker;
        if (imageCount === imageTicker) {
          triggerFinished($scriptTag, $tmpElement);
        }
      });
    } else {
      triggerFinished($scriptTag, $tmpElement);
    }
  }

  $('[type="text/x-whtevr"], .js-whtevr').each(function () {
    var $this = $(this);
    // We create this now because script tags don't have a bounding rect
    var $newElement = $('<div />');
    $newElement.insertAfter($this);

    if ($this.data('load-after')) {
      $window.on('load', function () {
        setTimeout(function () {
          loadNow($this, $newElement);
        }, $this.data('load-after'));
      });
    } else {
      whenScroll(['within 300px of', $newElement[0]], function () {
        loadNow($this, $newElement);
      }, true);
    }
  });

  $.fn.whtevrLoad = function () {
    return this.each(function (idx, elem) {
      var $this = $(elem);
      var $newElement = $('<div />')
        .hide();
      $newElement.insertAfter($this);
      loadNow($this, $newElement);
    });
  };

}));



















(function (root, factory) {
  if (typeof exports === 'object') {
    factory(require('jquery'), require('when-scroll'));
  } else {
    factory(root.$, root.whenScroll);
  }
}(this, function ($, whenScroll) {

  var $window = $(window);

  /**
   * Removes the hidden whtevr element from the DOM, and unwraps the loaded
   * content from the temporary <div> element.
   *
   * @param {jQuery} $scriptTag The whtevr element housing the hidden content
   * @param {jQuery} $tmpElement The <div> tag created for the bounding rect
   */
  function removeScriptTag($scriptTag, $tmpElement) {
    $scriptTag.remove();
    $tmpElement.children().unwrap();
  }

  /**
   * Loads the contents of the whtevr element.
   *
   * Takes the content within the whtevr element, and outputs it to a temporary
   * <div> element created earlier. Also checks for images, and fires an event
   * when all images have been loaded.
   *
   * @param {jQuery} $scriptTag The whtevr element housing the hidden content
   * @param {jQuery} $tmpElement The <div> tag created for the bounding rect
   */
  function loadNow($scriptTag, $tmpElement) {
    var isNoscript = ($scriptTag.prop('tagName') === 'NOSCRIPT');
    var $content = isNoscript ? $scriptTag.text() : $scriptTag.html();
    $tmpElement.html($.parseHTML($content));

    // @todo: Isn't this just the load event?
    var $images = $tmpElement.find('img');
    var imageTicker = 0;
    if (imageCount > 0) {
      $images.load(function () {
        ++imageTicker;
        if (imageTicker === $images.length) {
          $scriptTag.trigger('whtevr-images-loaded', [$tmpElement]);
          removeScriptTag($scriptTag, $tmpElement);
        }
      });
    }

    $scriptTag.trigger('whtevr-loaded', [ $tmpElement ]);

    // We add an additional parameter to see whether we should remove the DOM
    // element in the triggerFinished function, as we don't want to remove the
    // element if we have images to load, as the `whtevr-images-loaded` trigger
    // may not have an element to fire on if it's been removed here.
    var shouldRemove = imageCount === 0;
    if (shouldRemove) {
      removeScriptTag($scriptTag, $tmpElement);
    }
  }

  $('[type="text/x-whtevr"], .js-whtevr').each(function () {
    var $this = $(this);
    // We create this now because script tags don't have a bounding rect
    var $newElement = $('<div />');
    $newElement.insertAfter($this);

    // data-load-after to load the element after an interval of time
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

  /**
   * Enables calling .whtevrLoad() on an element to load the content within that
   * tag. The tag should be either a <noscript> or <script> tag.
   *
   * @return {jQuery} Self.
   */
  $.fn.whtevrLoad = function () {
    return this.each(function () {
      var $this = $(this);
      var $newElement = $('<div />').hide();
      $newElement.insertAfter($this);
      loadNow($this, $newElement);
    });
  };

}));

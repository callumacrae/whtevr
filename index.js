(function (root, factory) {
  if (typeof exports === 'object') {
    factory(require('jquery'), require('when-scroll'));
  } else {
    factory(root.$, root.whenScroll);
  }
}(this, function ($, whenScroll) {

  var $window = $(window);

  /**
   * Fire a custom event on $scriptTag, to say that the noscript content has
   * been switched out.
   * @param  {jQuery} $scriptTag  The <noscript>/<script> tag which houses the hidden content
   * @param  {jQuery} $tmpElement The <div> tag which temporarily houses the loaded content
   * @return {null}
   */
  function triggerFinished($scriptTag, $tmpElement) {
    $scriptTag
      .trigger('whtevr-loaded', [ $tmpElement ]);
  }

  /**
   * Removes the <script>/<noscript> tag from the DOM, and unwraps the loaded
   * content from the temporary <div> element.
   * @param  {jQuery} $scriptTag  The <noscript>/<script> tag which houses the hidden content
   * @param  {jQuery} $tmpElement The <div> tag which temporarily houses the loaded content
   * @return {null}
   */
  function removeScriptTag($scriptTag, $tmpElement) {
    $scriptTag
      .remove();
    $tmpElement.children().unwrap();
  }

  /**
   * Takes the content within the <noscript>/<script> tag, and outputs it to a
   * temporary <div> element which is created to house the content for
   * scroll-based calculations. Also checks for images, and fires an event when
   * all images have been loaded.
   * @param  {jQuery} $scriptTag  The <noscript>/<script> tag which houses the hidden content
   * @param  {jQuery} $tmpElement The <div> tag which temporarily houses the loaded content
   * @return {null}
   */
  function loadNow($scriptTag, $tmpElement) {
    // var $scriptTag = this.$scriptTag;
    // var $tmpElement = this.$tmpElement;
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
          $scriptTag
            .trigger('whtevr-images-loaded', [$tmpElement]);
          removeScriptTag($scriptTag, $tmpElement);
        }
      });
    }
    triggerFinished($scriptTag, $tmpElement);
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
   * @return {function} Loop through each of the matched elements
   */
  $.fn.whtevrLoad = function () {
    /**
     * Sets up the plugin by running the loadNow function, after creating an
     * empty <div> tag to house the content temporarily.
     * @param  {int} idx Counter
     * @param  {HTMLElement} elem  The individual element that matches the selector given to the plugin.
     * @return {null}
     */
    return this.each(function (idx, elem) {
      var $this = $(elem);
      var $newElement = $('<div />')
        .hide();
      $newElement.insertAfter($this);
      loadNow($this, $newElement);
    });
  };

}));

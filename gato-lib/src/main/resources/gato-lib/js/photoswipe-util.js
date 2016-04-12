var initPhotoSwipe = (function($) {
  var pswpCount = 0;

  return function(pswpSelector) {
    if (isEditMode) {
      return;
    }

    var buildItemList = function(el) {
      var link,
      thumb,
      size,
      item;

      return $(el).children().map(function() {
        link = $(this).find('a')[0];
        thumb = $(this).find('img')[0];
        if (!(link && thumb)) {
          return;
        }

        size = $(link).attr('data-size');
        if (size) {
          size = size.split('x');
        }

        if (!size) {
          return;
        }
        var aspectratio = parseFloat(size[0]) / parseFloat(size[1])

        // get screen size
        var vpwidth = window.screen.width * (window.devicePixelRatio || 1.0);
        var vpheight = window.screen.height * (window.devicePixelRatio || 1.0);

        // browse through the srcset data we were given
        // and find the optimal one to use
        var widths = $(link).attr('data-srcset').split(/,/);
        var href = $(link).attr('href');
        var finalwidth = parseInt(size[0], 10);
        var finalheight = finalwidth/aspectratio;
        for (i = 0; i < widths.length; i++) {
          var info = widths[i].trim().split(/\s+/);
          var width = parseInt(info[1], 10);
          if (width >= vpwidth && width <= finalwidth) {
            href = info[0];
            finalwidth = width;
            finalheight = finalwidth/aspectratio;
          }
        }

        // create slide object
        item = {
          src: href,
          title: $(link).attr('title'),
          w: finalwidth,
          h: finalheight
        };

        // if(thumb) {
        //   item.msrc = $(thumb).attr('src');
        // }

        item.el = this; // save link to element for getThumbBoundsFn

        return item;
      });
    };

    // triggers when user clicks on thumbnail
    var onThumbClick = function(e) {
      // find root element of slide
      var slide = $(e.target).parentsUntil(this).last()[0];
      var index = $(this).children().index(slide);
      if(index < 0) {
        return;
      }

      e.preventDefault();
      openPhotoSwipe(index, this);
    };

    var openPhotoSwipe = function(index, pswp, disableAnimation, fromURL) {
      var items = buildItemList(pswp);

      // define options (if needed)
      var options = {

        // define gallery index (for URL)
        galleryUID: $(pswp).attr('data-pswp-uid'),

        // getThumbBoundsFn: function(index) {
        //   // See Options -> getThumbBoundsFn section of documentation for more info
        //   var thumb = $(items[index].el).find('img')[0];

        //   pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        //   rect = thumb.getBoundingClientRect();

        //   return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
        // }

        getThumbBoundsFn:false,

        showHideOpacity: true,

        closeOnScroll: false,

        bgOpacity: 0.85

      };

      // PhotoSwipe opened from URL
      if(fromURL) {
        if(options.galleryPIDs) {
          // parse real index when custom PIDs are used
          // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
          for(var j = 0; j < items.length; j++) {
            if(items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          // in URL indexes start from 1
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }

      // exit if index not found
      if( isNaN(options.index) ) {
        return;
      }

      if(disableAnimation) {
        options.showAnimationDuration = 0;
      }

      // Pass data to PhotoSwipe and initialize it
      new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, items, options).init();
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};

      if(hash.length < 5) {
        return params;
      }

      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
        if(!vars[i]) {
          continue;
        }
        var pair = vars[i].split('=');
        if(pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }

      if(params.gid) {
        params.gid = parseInt(params.gid, 10);
      }

      return params;
    };

    $(pswpSelector).click(onThumbClick);

    $(pswpSelector).each(function() {
      $(this).attr('data-pswp-uid', (++pswpCount));
    });

    // Parse URL and open photoswipe if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
      openPhotoSwipe(hashData.pid, $(pswpSelector+'[data-pswp-uid='+hashData.gid+']'), true, true);
    }
  };

})(jQuery);

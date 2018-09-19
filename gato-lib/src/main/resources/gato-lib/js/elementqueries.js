(function ($) {
  window.elementqueries = function () {
    var eq = window.elementqueries;
    var watchlist = [];
    var busy = false;

    eq.processwidths = function () {
      for (var i = 0; i < watchlist.length; i++) {
        var widths = [];
        var attrs = [];
        for (var j = 0; j < watchlist[i].length; j++) {
          widths.push(watchlist[i][j].offsetWidth);
          attrs.push(watchlist[i][j].getAttribute('data-eq'));
        }
        for (var j = 0; j < watchlist[i].length; j++) {
          var w = widths[j];
          var attrstr = '';
          for (var k = 1200; k >= w && k > 700; k -= 100) attrstr += k+'px ';
          for (var k = 700; k >= w; k -= 50) attrstr += k+'px ';
          if (attrstr != attrs[j]) watchlist[i][j].setAttribute('data-eq', attrstr);
        }
      }
      busy = false;
    };

    eq.observetargets = function () {
      watchlist = [];
      $('.eq-parent').each(function () {
        var eqparent = $(this);
        var depth = eqparent.parents('.eq-parent').length;
        if (typeof(watchlist[depth]) == 'undefined') watchlist[depth] = [eqparent.get(0)];
        else watchlist[depth].push(eqparent.get(0));
      });
    };

    eq.refresh = function () {
      if (!busy && watchlist.length > 0) {
        busy = true;
        animationframe(eq.processwidths);
      }
    }

    eq.gotoanchor = function() {
      // since we are dramatically resizing, we need to scroll to the proper place for an
      // anchor tag
      if (document.location.hash.match(/^#[a-z][\w\-\:\.]*$/i)) {
        setTimeout(function () {
          var position = $(document.location.hash+', [name="'+document.location.hash.slice(1)+'"]').offset();
          if(position) $(document).scrollTop( position.top );
        }, 0);
      }
    }

    eq.update = function () {
      eq.observetargets();
      eq.refresh();
    }

    eq.update();
    eq.gotoanchor();
    $(window).resize(eq.refresh);
    observePrint(function () {
      $('body').addClass('print');
    }, function () {
      $('body').removeClass('print');
    });
  };
  $(document).ready(elementqueries);
})(jQuery);


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
          for (var k = 1200; k > w; k -= 100) attrstr += k+'px ';
          if (attrstr != attrs[j]) watchlist[i][j].setAttribute('data-eq', attrstr);
        }
      }
      busy = false;
    };

    eq.observetargets = function () {
      watchlist = [];
      $('.eq-parent').each(function () {
        var eqparent = $(this);
        var depth = eqparent.parents('.eq-parent').size();
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

    eq.update = function () {
      eq.observetargets();
      eq.refresh();
    }

    eq.update();
    $(window).resize(eq.refresh);
    observePrint(function () {
      $('body').addClass('print');
    }, function () {
      $('body').removeClass('print');
    });
  };
  $(document).ready(elementqueries);
})(jQuery);


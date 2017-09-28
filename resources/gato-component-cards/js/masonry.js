jQuery(function($) {
  magnolialabelchange('.gato-card-add', '.mgnlEditor.mgnlPlaceholder', 'Add Card');

  var $masonry = $(".section-masonry").packery({
    itemSelector: ".gato-card",
    columnWidth: ".masonry-sizer",
    gutter: ".masonry-gutter",
    percentPosition: true,
    initLayout: false,
    resize: false
  });
  var masonrylayout = function(){$masonry.packery('layout');}
  resizeTimeout(masonrylayout);
  waitforselector('.gato-card-add', '.mgnlEditorBar', masonrylayout);

  window.gatogridlayout = function ($grids) {
    $grids.each(function() {
      var $grid = $(this);

      if ($grid.is('.forcegrid')) {
        var $captions = $grid.find('figcaption');
        var maxfigureheight = Math.max.apply(null, $captions.map(function() {
          return $(this).find('h3').outerHeight(true)+$(this).find('.caption-content').outerHeight(true)+$(this).outerHeight()-$(this).height();;
        }));
        animationframe(function () { $captions.css('min-height', maxfigureheight+'px'); });
        return;
      }
      var sectionwidth = $grid.width();
      var sizerwidth = $grid.find('.masonry-sizer').width();
      var gutterwidth = $grid.find('.masonry-gutter').width();
      var numcols = Math.round(sectionwidth/sizerwidth);
      if (numcols > 100000) return; // sanity check, could be Infinity if there was no .masonry-sizer and crash browser
      var colwidth = sizerwidth+gutterwidth;
      var colwidthpercent = 100.0 * colwidth / sectionwidth;
      var colheights = [];
      for (var i = 0; i < numcols; i++) { colheights[i] = 0.0; }
      $grid.find('.gato-card:visible').velocity('stop').each(function(idx) {
        var $card = $(this);
        var cardheight = $card.outerHeight(true);
        var fudge = Math.min(150,cardheight/2);
        var bestheight = colheights[0];
        var bestidx = 0;
        for (var i = 1; i < numcols; i++) {
          if (colheights[i] < bestheight - fudge) {
            bestidx = i;
            bestheight = colheights[bestidx];
          }
        }
        colheights[bestidx] += cardheight+gutterwidth;
        $card.velocity({'top': bestheight+'px', 'left': (bestidx*colwidthpercent)+'%'}, {duration: 150});
      });
      animationframe(function() {$grid.css('height', Math.max.apply(Math, colheights)+'px');});
    });
  }
  var $grids = $('.section-grid');
  var executegridlayout = function () { gatogridlayout($grids) }
  resizeTimeout(executegridlayout);
  waitforselector('.section-grid-edit', '.mgnlEditorBar', executegridlayout);

  /* Special treatment for youtube: clip the splash image since it gets black bars */
  $('.gato-card-video.youtube').each(function(index, ele) {
    var video = $(ele);
    var splash = video.find('img');
    video.find('.gato-card-video-splash').css('background-image', 'url('+splash.attr('src')+')');
  });

  /*Opening rss content on new tab on header click*/
  $('.gato-card-rss-container').on('click','.gato-accordion-header',function(){
      var $rssOpenUrl=$(this).children('a').attr('href');
      if($rssOpenUrl.length>0){
          window.open($rssOpenUrl, '_blank');
      }
  });

});

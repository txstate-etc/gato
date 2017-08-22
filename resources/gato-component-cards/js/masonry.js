jQuery(function($) {
  magnolialabelchange('.gato-card-add', '.mgnlEditor.mgnlPlaceholder', 'Add Card');

  var $masonry = $(".section-masonry").masonry({
    itemSelector: ".gato-card",
    columnWidth: ".masonry-sizer",
    gutter: ".masonry-gutter",
    percentPosition: true,
    initLayout: false
  });
  setTimeout(function(){$masonry.masonry('layout');},0);

  window.gatogridlayout = function ($grids, args) {
    args = args || {};
    $grids.each(function() {
      var $grid = $(this);
      var sectionwidth = $grid.width();
      var sizerwidth = $grid.find('.masonry-sizer').width();
      var gutterwidth = $grid.find('.masonry-gutter').width();
      var numcols = Math.round(sectionwidth/sizerwidth);

      // a resize event doesn't require a full recalc unless the number of columns
      // has changed, but the container height does need to be re-evaluated
      if ($grid.data('last-gridlayout-cols') == numcols && args.resize) {
        var maxheight = 0;
        $grid.find('.gato-card:visible').each(function() {
          var $card = $(this);
          var h = $card.position().top+$card.height();
          if (h > maxheight) maxheight = h;
        });
        $grid.css('height', (maxheight+gutterwidth)+'px');
        return;
      }
      $grid.data('last-gridlayout-cols', numcols);

      var colwidth = sizerwidth+gutterwidth;
      var colwidthpercent = 100.0 * colwidth / sectionwidth;
      var colheights = [];
      for (var i = 0; i < numcols; i++) { colheights[i] = 0.0; }
      $grid.find('.gato-card:visible').velocity('stop').each(function() {
        var $card = $(this);
        var cardheight = $card.height();
        var fudge = Math.min(200,cardheight/2);
        var bestheight = colheights[0];
        var bestidx = 0;
        for (var i = 1; i < numcols; i++) {
          if (colheights[i] < bestheight - fudge) {
            bestheight = colheights[i];
            bestidx = i;
          }
        }
        colheights[bestidx] = cardheight+gutterwidth;
        $card.velocity({'top': bestheight+'px', 'left': (bestidx*colwidthpercent)+'%'}, {duration: 150});
      });
      $grid.css('height', Math.max.apply(Math, colheights)+'px');
    });
  }
  var $grids = $('.section-grid');
  $grids.find('img').one('load', function () { gatogridlayout($grids); });
  resizeTimeout(function () { gatogridlayout($grids, {resize: true}); });

  /*
    For adding youtube or Vimeo thumbnails if no custom thumbnail is added
    className will be set to .img-box first child className.
    If that className is userThumbnail then that means the user has added a thumbnail
    which means theres no need to fetch a thumbnail.
    Only works for vimeo and youtube videos for now.

  */
  $('.gato-card-video').each(function(index, ele) {
    var video = $(ele);
    var lnk = video.find('a');
    var splash = video.find('img');
    var updatelayouts = function () {
      video.closest('.section-masonry').masonry('layout');
      gatogridlayout(video.closest('.section-grid'));
    }

    if(splash.hasClass('default')){
      var href = lnk.attr('href');
      var split = href.split('/');
      if(href.match(/vimeo\.com/i)){
        var vimeoID=split[split.length-1];
        $.getJSON('http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID, function(video) {
          splash.one('load', updatelayouts).attr('src', video.thumbnail_url).closest('.gato-card-video').addClass('vimeo');
        });
      }
      else if (href.match(/youtu(\.be|be\.com)/i)) {
        var secondsplit = split[split.length-1].split('=');
        var youtubeID = secondsplit[secondsplit.length-1];
        splash.closest('figure').css('background-image', 'url(http://img.youtube.com/vi/'+youtubeID+'/0.jpg)')
          .closest('.gato-card-video').addClass('youtube');
        updatelayouts();
      }
    }
  });

  /*Opening rss content on new tab on header click*/
  $('.gato-card-rss-container').on('click','.gato-accordion-header',function(){
      var $rssOpenUrl=$(this).children('a').attr('href');
      if($rssOpenUrl.length>0){
          window.open($rssOpenUrl, '_blank');
      }
  });

});

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
      var sectionwidth = $grid.width();
      var sizerwidth = $grid.find('.masonry-sizer').width();
      var gutterwidth = $grid.find('.masonry-gutter').width();
      var numcols = Math.round(sectionwidth/sizerwidth);
      var colwidth = sizerwidth+gutterwidth;
      var colwidthpercent = 100.0 * colwidth / sectionwidth;
      var colheights = [];
      for (var i = 0; i < numcols; i++) { colheights[i] = 0.0; }
      $grid.find('.gato-card:visible').velocity('stop').each(function() {
        var $card = $(this);
        var cardheight = $card.outerHeight(true);
        var fudge = Math.min(200,cardheight/2);
        var bestheight = colheights[0];
        var bestidx = 0;
        for (var i = 1; i < numcols; i++) {
          if (colheights[i] < bestheight - fudge) {
            bestheight = colheights[i];
            bestidx = i;
          }
        }
        colheights[bestidx] += cardheight+gutterwidth;
        $card.velocity({'top': bestheight+'px', 'left': (bestidx*colwidthpercent)+'%'}, {duration: 150});
      });
      $grid.css('height', Math.max.apply(Math, colheights)+'px');
    });
  }
  var $grids = $('.section-grid');
  var executegridlayout = function () { gatogridlayout($grids) }
  resizeTimeout(executegridlayout);
  waitforselector('.section-grid-edit', '.mgnlEditorBar', executegridlayout);

  /* Special treatment for youtube and vimeo: fetch preview images if
     the user did not upload a splash image */
  $('.gato-card-video').each(function(index, ele) {
    var video = $(ele);
    var lnk = video.find('a');
    var splash = video.find('img');
    var updatelayouts = function () {
      var $masonry = video.closest('.section-masonry')
      if ($masonry.length > 0) $masonry.packery('layout');
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

jQuery(function($) {
  var $grid = $(".section-masonry").masonry({
    itemSelector: ".gato-card",
    columnWidth: ".masonry-sizer",
    gutter: 0,
    percentPosition: true,
  });
  setTimeout(function(){$grid.masonry('layout');},0);

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

    if(splash.hasClass('default')){
      var href = lnk.attr('href');
      var split = href.split('/');
      if(href.match(/vimeo\.com/i)){
        var vimeoID=split[split.length-1];
        $.getJSON('http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID, function(video) {
          splash.attr('src', video.thumbnail_url).closest('.gato-card-video').addClass('vimeo');
          $grid.masonry('layout');
        });
      }
      else if (href.match(/youtu(\.be|be\.com)/i)) {
        var secondsplit = split[split.length-1].split('=');
        var youtubeID = secondsplit[secondsplit.length-1];
        splash.closest('figure').css('background-image', 'url(http://img.youtube.com/vi/'+youtubeID+'/0.jpg)')
          .closest('.gato-card-video').addClass('youtube');
        $grid.masonry('layout');
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

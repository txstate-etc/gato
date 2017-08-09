
jQuery(window).on('load', function($) {
    var $ = jQuery;
    var $grid = $(".masonry-section").masonry({
    itemSelector: ".card-item",
    columnWidth: ".masonry-sizer",
    gutter: 0,
    percentPosition: true,
  });
  setTimeout(function(){$grid.masonry('layout');},1000);
  /*
    For adding youtube or Vimeo thumbnails if no custom thumbnail is added
    className will be set to .img-box first child className.
    If that className is userThumbnail then that means the user has added a thumbnail
    which means theres no need to fetch a thumbnail.
    Only works for vimeo and youtube videos for now.

  */
  $('.gato-card-streaming-wrap .img-box').each(function(index) {
    let className = $(this).siblings().context.firstElementChild.className;
    let userThumbnail=false;
    (className==='userThumbnail')? userThumbnail = true:userThumbnail=false;
    
    if(!userThumbnail){
      var linkArray= $('.gato-card-streaming-wrap a').eq(index)[0].href.split('/');
      let vimeo = linkArray[2]==='vimeo.com';
      let youtube =linkArray[2]==='www.youtube.com';
      if(vimeo){
        var vimeoID=linkArray[linkArray.length-1];//grab the last part of the link which is the id for vimeo.
        $.getJSON('http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID, function(video) {
            console.log(video.thumbnail_url);
            var $image = $(`<img src='${video.thumbnail_url}'>`);
            $('.gato-card-streaming-wrap .img-box').eq(index).append($image);
              $grid.masonry('layout');
        });
      }
      else if (youtube) {
          //if its a youtube video further split the end of the link which -
          //-follows the pattern watch?v='some-id-num and grab the last value in the array'
          var youtubeLink=linkArray[linkArray.length-1].split('=');
          var youtubeID=youtubeLink[youtubeLink.length-1];
          var youtubeImage=`http://img.youtube.com/vi/${youtubeID}/0.jpg`
          var $image = $(`<img src='${youtubeImage}' class='youtubeThumbnail'>`);
          $('.gato-card-streaming-wrap .img-box').eq(index).append($image);
            $grid.masonry('layout');
      }
    }
  });

});


jQuery(window).on('load', function($) {

    var $ = jQuery;
    var $grid = $(".masonry-section").masonry({
    itemSelector: ".gato-card",
    columnWidth: ".masonry-sizer",
    gutter: 0,
    percentPosition: true,
  });
  //for adding youtube or Vimeo thumbnails if no custom thumbnail is added
  $('.gato-card-streaming-wrap a').each(function(index) {
    if(!$('.img-box img').eq(index+1).hasClass('userThumbnail')){
      var linkArray=this.getAttribute('href').split('/');
      if(linkArray[2]==='vimeo.com'){
        var vimeoID=linkArray[linkArray.length-1];//grab the last part of the link which is the id for vimeo.
        $.getJSON('http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID, function(video) {
            console.log(video.thumbnail_url);
            var $image = $(`<img src='${video.thumbnail_url}'>`);
            $('.gato-card-streaming-wrap .img-box').eq(index).append($image);
              $grid.masonry('layout');
        });
      }
      else if (linkArray[2]==='www.youtube.com') {
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

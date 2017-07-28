jQuery(function($) {
  /** code from video-slide js modified to work for videos in masonry section**/
  var masonryVideo = {
    isOpen: false,

    loadModal: function(play) {
      var dataEmbed = play.getAttribute('data-embed');
      var dataUrl = play.getAttribute('href')
      var $container = $('<div class="gatoEmbedContainer" data-url="' + dataUrl + '" data-embed=\''+ dataEmbed +'\'></div>');
      $('.masonry-video-modal .video-container').empty().append($container);
      createPlayer($container, dataUrl, { autoplay: true });
    },

    open: function(play) {
      this.isOpen = true;
      this.loadModal(play);
      $('.masonry-video-modal').fadeIn(150);
    },

    close: function() {
      $('.masonry-video-modal').fadeOut(150);
      $('.masonry-video-modal .video-container').empty();
      this.isOpen = false;
    }
  };

  $('.masonry-section .feature-play-button a').blurclick(function(e) {
    console.log(this.getAttribute('href'));
    masonryVideo.open(this);
  });

  $('.masonry-video-modal .video-modal-close').blurclick(masonryVideo.close);
  $('.masonry-video-modal').on('click', masonryVideo.close);
  $(window).on('keydown', function(e) {
    if (masonryVideo.isOpen && e.keyCode == 27) {
      masonryVideo.close();
    }
  });
});
//to set thumbnail for youtube and vimeo videos.
jQuery(window).on('load', function($) {
    var $ = jQuery;
    $('.gato-card-streaming-wrap a').each(function(index) {
      var linkArray=this.getAttribute('href').split('/');
      if(!$('.img-box img').eq(index+1).hasClass('userThumbnail')){
        if(linkArray[2]==='vimeo.com'){
          var vimeoID=linkArray[linkArray.length-1];//grab the last part of the link which is the id for vimeo.
          $.getJSON('http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID, function(video) {
              console.log(video.thumbnail_url);
              var $image = $(`<img src='${video.thumbnail_url}'>`);
              $('.gato-card-streaming-wrap .img-box').eq(index).append($image);
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
        }
      }
    });
});

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
  

});

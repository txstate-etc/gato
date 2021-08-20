(function ($) {
  $(document).ready(function () {
    var preview = false;
    var banners = $('.hero-image-container');
    var captions = $('figcaption');
    banners.each(function() {
      if ($(this).hasClass('preview')) {
        preview = true;
      }
    })
    if (!preview) {
      var seed = Math.floor(Math.random()*banners.length);
      $(banners[seed]).addClass('activated');
      $(captions[seed]).addClass('activated');
    }
    $('.btnPauseVideo').on('click', function() {
      var video = $(this).parent().find('.hero-video')
      if ($(this).hasClass('paused')) {
        video[0].play()
        $(this).removeClass('paused')
      } else {
        video[0].pause()
        $(this).addClass('paused')
      }
    })
  });
})(jQuery);

// document.addEventListener("DOMContentLoaded", function() {
//     var lazyImages = [].slice.call(document.querySelectorAll("img.slide-image"));
//
//     if ("IntersectionObserver" in window) {
//       var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
//         entries.forEach(function(entry) {
//           if (entry.isIntersecting) {
//             var lazyImage = entry.target;
//             lazyImage.src = lazyImage.dataset.src;
//             lazyImage.srcset = lazyImage.dataset.srcset;
//             lazyImage.classList.remove("lazy");
//             lazyImageObserver.unobserve(lazyImage);
//           }
//         });
//       });
//
//       lazyImages.forEach(function(lazyImage) {
//         lazyImageObserver.observe(lazyImage);
//       });
//     } else {
//       // Possibly fall back to a more compatible method here
//     }
//   });

(function ($) {
    $(document).ready(function () {
        var preview = false;
        var banners = $('.image-container');
        var captions = $('figcaption');
        banners.each(function() {
        if ($(this).hasClass('preview')) {
            preview = true;
        }
        })
        if (!preview) {
            var seed = Math.floor(Math.random()*banners.length);
            console.log(seed);
            $(banners[seed]).addClass('activated');
            $(captions[seed]).addClass('activated');
        }
    });
})(jQuery);
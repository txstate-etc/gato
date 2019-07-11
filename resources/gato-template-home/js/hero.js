(function ($) {
        $(document).ready(function () {
        var banners = $('.image-container');
        var captions = $('figcaption');
        var seed = Math.floor(Math.random()*banners.length);
        console.log(seed);
        $(banners[seed]).addClass('activated');
        $(captions[seed]).addClass('activated');
    });
})(jQuery);
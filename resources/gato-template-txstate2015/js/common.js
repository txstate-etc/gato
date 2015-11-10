// No delay on mobile tapping

window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);

// Background image delay and fade

jQuery(window).load(function() {
    jQuery(".bg_image").delay(200).animate({
        opacity: "1"
    }, 500);
});

jQuery(window).load(function() {
    jQuery(".bg_image_secondary").delay(0).animate({
        opacity: "1"
    }, 500);
});

// Parallax scrolling effect

jQuery(window).scroll(function(e) {
    parallax();
});

function parallax() {
    var scrolled = jQuery(window).scrollTop();
    jQuery(".bg_image, .bg_image_secondary").css("top", (scrolled * .6) + "px");
}

jQuery(document).ready(function($) {

	// Fixed desktop navigation
    jQuery('.top_nav').scrollToFixed();

 // Back to top
    jQuery('.btt').on("click", function() {
        jQuery('html,body').animate({
            scrollTop: 0
        }, 500)
    });


    // Mobile navigation

    var slideout = new Slideout({
        'panel': document.getElementById('panel'),
    	'menu': document.getElementById('menu'),
    	'padding': 300,
    	'tolerance': 70,
    	'side': 'right',
    	'duration': 300,
    	'touch': false
    });

    jQuery('.toggle-button').on("click", function(){
    	slideout.toggle();
    });

  $('.more-tools > a').hovermenu('.super-list-sub');
});



// No delay on mobile tapping

window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);

// Background image delay and fade 

$(window).load(function() {
    $(".bg_image").delay(200).animate({
        opacity: "1"
    }, 500);
});

$(window).load(function() {
    $(".bg_image_secondary").delay(0).animate({
        opacity: "1"
    }, 500);
});

// Parallax scrolling effect

$(window).scroll(function(e) {
    parallax();
});

function parallax() {
    var scrolled = $(window).scrollTop();
    $(".bg_image, .bg_image_secondary").css("top", (scrolled * .6) + "px");
}

$(document).ready(function() {
	// Fixed desktop navigation
    $('.top_nav').scrollToFixed();
    
 // Back to top
    $('.btt').on("click", function() {
        $('html,body').animate({
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
    
    $('.toggle-button').on("click", function(){
    	slideout.toggle();
    });
    
});


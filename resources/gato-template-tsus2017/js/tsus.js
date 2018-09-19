jQuery(document).ready(function($) {

    //copied from Wittliff template.  TODO: Move this into a place where it can be shared
    // Main Menu Hamburger Button
  var header = $('.page-header');
  var menucontainer = $('.main-menu');
  var menubtn = $('.main-menu >button');
  var menupanel = $('.main-menu .main-menu-panel');
  var menuhide = function () {
    header.removeClass('menu-out');
    menubtn.attr('aria-expanded', false);
    menupanel.velocity('slideUp', { duration: 150 });
  }
  var menushow = function() {
    header.addClass('menu-out');
    menubtn.attr('aria-expanded', true);
    menupanel.velocity('slideDown', { duration: 150 });
  }
  menubtn.click(function (e) {
    if (header.hasClass('menu-out')) menuhide();
    else menushow();
  })
  $('html').click( function (e) {
    if (!$.contains(menucontainer.get(0), e.target)) {
      menuhide();
    }
  });
  // close the menu with the escape key
  $(document).keyup(function (e) {
    if (e.keyCode === 27 && header.hasClass('menu-out')) {
      e.preventDefault();
      menuhide();
    }
  });

  // Main Menu expand/contract
  $('.simplemenu-expand').click(function (e) {
    var btn = $(this);
    var toplevel = btn.closest('li');
    var panel = toplevel.find('.simplemenu-subitems');
    toplevel.toggleClass('expanded');
    btn.attr('aria-expanded', toplevel.hasClass('expanded'));
    panel.velocity(toplevel.hasClass('expanded') ? 'slideDown' : 'slideUp', { duration: 150 });
  });

    function evaluate_tsus_logos() {
      var container = $('.gato-flex-container');
      var logos = container.find('li');
      var logocount = logos.length;
      var minwidth = 100;
      var maxwidth = 300;
      var absolutemaxcols = Math.min(logocount, 12);
      var containerwidth = container.width();
      var maxcols = Math.min(Math.floor(containerwidth / minwidth), absolutemaxcols);
      var mincols = Math.max(Math.ceil(containerwidth / maxwidth), 1);
      var currentbest = maxcols;
      for (var i = mincols; i <= maxcols; i++) {
        var proposedremainder = (i - (logocount % i)) % i;
        if (proposedremainder < 2) currentbest = i;
      }
      container.removeClass(function (idx, classname) {
        return (classname.match (/flex-columns-\S+/g) || []).join(' ');
      }).addClass('flex-columns-'+currentbest);
    }

    resizeTimeout(evaluate_tsus_logos);

     $('body.admin #tsus-main-menu a, body.admin a.tsus-homelink').each(function(){
       $(this).attr('role', 'navigation');
     });
});

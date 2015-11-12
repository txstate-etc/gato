jQuery(document).ready(function ($) {
  var sidebar = $('.page_content .sidebar');

  // prevent sidebar from flowing behind the footer,
  // since it is position: absolute
  resizeTimeout(function() {
    $('.page_content').css('min-height', (sidebar.height()+15)+'px');
  });

  // find the first gato-component paragraph whose top is
  // below the sidebar and expand it to full width
  resizeTimeout(function() {
    $('.page_content .gato-component').each(function (i, cmp) {
      cmp = $(cmp);
      if (cmp.position().top > sidebar.position().top+sidebar.height()) {
        cmp.css('width', '100%');
      } else {
        cmp.css('width', '');
      }
    });
  });
});

jQuery(document).ready(function ($) {
  var sidebar = $('.sidebar-container .sidebar');
  var pagecontent = $('.contentcolumn');

  if (sidebar.length > 0) {
    var expandsectionsaftersidebar = function () {
      // find the first gato-component paragraph whose top is
      // below the sidebar and expand it to full width
      $('.gato-section').each(function (i, cmp) {
        cmp = $(cmp).closest('.gato-section-full');
        if (cmp.offset().top > sidebar.offset().top+sidebar.outerHeight()) {
          cmp.addClass('full-width');
        } else {
          cmp.removeClass('full-width');
        }
      });
      $('.gato-msection').each(function (i, cmp) {
        var msection = $(cmp)
        if (msection.offset().top > sidebar.offset().top+sidebar.outerHeight()) {
          msection.addClass('full-width')
        } else {
          msection.removeClass('full-width')
        }
      });
    };

    resizeTimeout(expandsectionsaftersidebar);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', expandsectionsaftersidebar);
  }
});

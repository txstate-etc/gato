jQuery(document).ready(function ($) {
  var sidebar = $('.sidebar-container');
  var pagecontent = $('.contentcolumn');

  if (sidebar.size() > 0) {
    var expandsectionsaftersidebar = function () {
      // find the first gato-component paragraph whose top is
      // below the sidebar and expand it to full width
      $('.page_content .gato-section').each(function (i, cmp) {
        cmp = $(cmp);
        if (cmp.offset().top > sidebar.offset().top+sidebar.height())
          cmp.addClass('full-width');
        if (!cmp.hasClass('full-width'))
          cmp.closest('.gato-section-parent').removeClass('has-background');
      });
    };

    resizeTimeout(expandsectionsaftersidebar);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', expandsectionsaftersidebar);
  }
});

jQuery(document).ready(function ($) {
  var sidebar = $('.page_content .sidebar-container');
  var pagecontent = $('.page_content');
  var footer = $('.footer');

  if (sidebar.size() > 0) {
    // prevent sidebar from flowing behind the footer,
    // since it is position: absolute
    var setsidebarminheight = function() {
      pagecontent.css('min-height', Math.max($(window).height()-pagecontent.offset().top-footer.height(), sidebar.height()+75)+'px');
    };
    resizeTimeout(setsidebarminheight);
    mutationTimeout(sidebar.get(0), setsidebarminheight);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', setsidebarminheight);

    var expandsectionsaftersidebar = function () {
      // find the first gato-component paragraph whose top is
      // below the sidebar and expand it to full width
      $('.page_content .gato-section').each(function (i, cmp) {
        cmp = $(cmp);
        if (cmp.offset().top > sidebar.offset().top+sidebar.height()) {
          cmp.closest('.gato-section').addClass('full-width');
        } else {
          cmp.closest('.gato-section-parent').removeClass('has-background');
        }
      });
    };

    resizeTimeout(expandsectionsaftersidebar);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', function () { setTimeout(expandsectionsaftersidebar, 0); });
  }
});

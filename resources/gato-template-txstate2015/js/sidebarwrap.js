jQuery(document).ready(function ($) {
  var sidebar = $('.page_content .sidebar');
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
      $('.page_content .gato-section .columns-container').each(function (i, cmp) {
        cmp = $(cmp);
        if (cmp.offset().top > sidebar.offset().top+sidebar.height()) {
          cmp.closest('.gato-section').addClass('full-width');
        } else {
          cmp.closest('.gato-section-parent').removeClass('has-background');
        }
      });
    };

    var setsidebarwidthandposition = function() {
      var alignment = $('.content-alignment');
      if(alignment.size() > 0){
        var sidebarWidthPercent = parseInt(alignment.attr('data-sidebar-width-percentage'))
        sidebar.css('right', alignment.offset().left);
        sidebar.css('width', alignment.width() * (sidebarWidthPercent/100) + "px");
      }
      if(sidebar.css('position') != 'absolute') {
        sidebar.css('width', '100%');
      }
    }
    resizeTimeout(setsidebarwidthandposition);

    resizeTimeout(expandsectionsaftersidebar);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', function () { setTimeout(expandsectionsaftersidebar, 0); });
  }
});

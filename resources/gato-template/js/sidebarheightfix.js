jQuery(document).ready(function ($) {
  // Make sure page is tall enough to accomodate the sidebar height
  // .contentcolumn is position relative and its top should be lined up with sidebar
  // so we'll use a min-height to push down the page as needed
  var sb = $('.sidebar-container .sidebar');
  var contentcol = $('.contentcolumn');
  if (sb.length > 0 && contentcol.length > 0) {
    var sidebarheightfix = function () {
      contentcol.css('min-height', sb.outerHeight() - contentcol.offset().top + sb.offset().top + 50);
    }
    resizeTimeout(sidebarheightfix);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', sidebarheightfix);
  }
});

jQuery(document).ready(function ($) {
  // Make sure page is tall enough to accomodate the sidebar height
  // .contentcolumn is position relative and its top should be lined up with sidebar
  // so we'll use a min-height to push down the page as needed
  var sbc = $('.sidebar-container');
  var contentcol = $('.contentcolumn');
  if (sbc.size() > 0 && contentcol.size() > 0) {
    var sidebarheightfix = function () {
      contentcol.css('min-height', sbc.outerHeight() - contentcol.offset().top + sbc.offset().top + 50);
    }
    resizeTimeout(sidebarheightfix);
    waitforselector('.navBlocks_add', '.mgnlEditor.mgnlPlaceholder', sidebarheightfix);
  }
});

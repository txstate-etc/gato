jQuery(document).ready(function($) {
  // Adapted from Wittliff code for making sure the footer stays at the bottom of the page
  var win = $(window);
  var bannerSection = $('.banner-section')
  var orgInfo = $('.organization-info')
  var pageContent = $('.main-content')
  var footer = $('footer')
  var pagecontentheightfix = function () {
    var minHeight = win.height() - bannerSection.outerHeight(true) - orgInfo.outerHeight(true) - footer.outerHeight(true) - pageContent.outerHeight(true) + pageContent.outerHeight() - 1
    pageContent.css('min-height', minHeight)
    if ($('#search-results').length) {
      $('#search-results').css('min-height', minHeight)
    }
  }
  resizeTimeout(pagecontentheightfix);
})
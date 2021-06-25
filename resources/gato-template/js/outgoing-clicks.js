// generate Google Analytics events for link clicks
jQuery(document).ready(function($) {
  $('a').on('click', function() {
    var link = $(this)
    var linkAddress = link.attr('href')
    var linkName = link.text()
    var thisPageAddress = window.location
    var thisPageTitle = document.title
    if (typeof(destroyerGlobalPageTracker) != 'undefined') {
      ga(destroyerGlobalPageTracker.name + '.send', {
        'hitType': 'event',
        'eventCategory': 'Links',
        'eventAction': thisPageTitle + " <" + thisPageAddress + ">",
        'eventLabel': linkName + " <" + linkAddress + ">",
        'transport': 'beacon'
      })
    }
    if (typeof(destroyerSitePageTracker) != 'undefined') {
      ga(destroyerSitePageTracker.name + '.send', {
        'hitType': 'event',
        'eventCategory': 'Links',
        'eventAction': thisPageTitle + " <" + thisPageAddress + ">",
        'eventLabel': linkName + " <" + linkAddress + ">",
        'transport': 'beacon'
      });
    }
  })
});

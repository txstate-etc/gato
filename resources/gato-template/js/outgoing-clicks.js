// generate Google Analytics events for link clicks
document.observe('dom:loaded', function() {
  $$('a').each( function(item) {
    item.observe('click', function() {
      var linkAddress = item.href;
      var linkName = item.text;
      var thisPageAddress = window.location;
      var thisPageTitle = document.title;

      if (typeof(destroyerGlobalPageTracker) != 'undefined') {
        ga(destroyerGlobalPageTracker.name + '.send', {
          'hitType': 'event',
          'eventCategory': 'Links',
          'eventAction': thisPageTitle + " <" + thisPageAddress + ">",
          'eventLabel': linkName + " <" + linkAddress + ">",
          'transport': 'beacon'
        });
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
    });
  });
});

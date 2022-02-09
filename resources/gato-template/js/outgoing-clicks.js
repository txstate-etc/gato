// generate Google Analytics events for link clicks
jQuery(document).ready(function($) {
  function gtag(){window.dataLayer.push(arguments);}
  $('a').on('click', function() {
    if (window.sendAnalyticsEvents) {
      var link = $(this);
      gtag('event', 'Links', {
        'event_action': document.title + " <" + window.location + ">",
        'event_label': link.text() + " <" + link.attr('href') + ">"
      });
    }
  })
});

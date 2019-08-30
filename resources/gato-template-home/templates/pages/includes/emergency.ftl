[#assign emergencycontent = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/emergency', 'gatoapps'))]
[#if gf.hasChildren(emergencycontent)]
[#assign isEmergency = true]
  [#assign notification = cmsfn.children(emergencycontent, "mgnl:component")?first]
  <div class="emergency-notification ${notification.color!color10}">
    <div class="title">
      <i class="emergency-icon fa fa-exclamation-circle" aria-hidden="true"></i>
      Texas State Alert
    </div>
    <a class="emergency-link" href="${gf.filterUrl(notification.link)}">
      ${notification.text}
    </a>
    <div class="alert-timestamp">
      [#-- <p>Updated: Aug. 29, 2019 at 11:29 a.m. CDT</p> --]
      <p>Updated: ${gf.getModificationDate(notification)?string("MMM. dd, yyyy 'at' h:mm a z")}</p>
    </div>
  </div>
  <script>
  jQuery(document).ready(function($) {
    $('body').addClass('emergency');
    var notificationHeight = $('.emergency-notification').outerHeight();
    $(window).on('scroll', function(e) {
      if ($(window).scrollTop() > notificationHeight) {
        $('body').removeClass('emergency');
      }
      else {
        $('body').addClass('emergency');
      }
    })
  })
  </script>
[/#if]
  

[#assign emergencycontent = cmsfn.asContentMap(cmsfn.nodeByPath('/homepage-data/emergency', 'gatoapps'))]
[#if gf.hasChildren(emergencycontent)]
[#assign isEmergency = true]
  [#assign notification = cmsfn.children(emergencycontent, "mgnl:component")?first]
  <div class="emergency-notification ${notification.color!color10}">
    <div class="title">
      <i class="emergency-icon fa fa-exclamation-circle" aria-hidden="true"></i>
      Texas State Alert
    </div>
    [#if !gf.isEmptyString(notification.link)]
      <a class="emergency-link" href="${gf.filterUrl(notification.link)}">
        ${notification.text}
      </a>
    [#else]
      <div class="emergency-link">
        ${notification.text}
      </div>
    [/#if]
    <div class="emergency-info">
      ${gf.processRichText(cmsfn.decode(notification).info)}
    </div>
    [#if notification.timestamp??]
      [#if notification.timestamp="manualtimestamp"]
        <div class="alert-timestamp">
          <p>Updated: ${notification.manualtimestamp?string("MMM. dd, yyyy 'at' h:mm a z")}</p>
        </div>
      [/#if]
    [/#if]
  </div>
  <script>
  jQuery(document).ready(function($) {
    function positionHeader(notificationHeight) {
      if ($(window).scrollTop() > notificationHeight) {
        $('body').removeClass('emergency');
        $('header').css('top', 0)
      }
      else {
        $('body').addClass('emergency');
        $('header').css('top', notificationHeight)
      }
    }
    $('body').addClass('emergency');
    $(window).on('scroll', function(e) {
      positionHeader($('.emergency-notification').outerHeight())
    })
    $(window).on('resize', function(e) {
      positionHeader($('.emergency-notification').outerHeight())
    })
    positionHeader($('.emergency-notification').outerHeight());
  })
  </script>
[/#if]
  

[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign contentWidthClass = hideSidebar?string('full-width','')]
<div class="gato-section-full ${contentWidthClass}">
  <div class="gato-section-centered">
    [@cms.area name="eventlist" /]
  </div>
</div>
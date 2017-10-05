[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#include "/gato-template/templates/includes/section.ftl"]

[#assign aspectclass = 'tall']
[#if gf.getImgAspectRatio(content.image) > 2.2]
  [#assign aspectclass = 'wide']
[/#if]

<div class="gato-eventbanner">
  <div class="eventbanner-image ${aspectclass}">
    <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}" />
  </div>
  <div class="eventbanner-panel ${content.layout!'left'}">
    <div class="typeheader" data-max-lines="1">
      [#if content.type == 'exhibition']
        Featured Exhibition
      [#elseif content.type == 'event']
        Featured Event
      [#elseif content.type == 'permanent']
        Permanent Exhibition
      [#elseif content.type == 'ongoing']
        Ongoing
      [/#if]
    </div>
    <h2>
      <span class="title" data-max-lines="3">${content.title!}</span>
      [#if content.subtitle?has_content]<div class="subtitle" data-max-lines="2">${content.subtitle}</div>[/#if]
    </h2>
    [#if content.type == 'event' || content.type == 'exhibition']
    <div class="dates">
      [#if content.type == 'exhibition']
        <span class="start">${content.start?string['MMM d']}</span>
        <span class="separator">-</span>
        <span class="end">${content.end?string['MMM d']}</span>
      [#else]
        <span class="date">${content.start?string['MMMM d']}</span>
        <span class="separator">/</span>
        <span class="time">${content.start?string['h:mm a']?lower_case}</span>
      [/#if]
    </div>
    [/#if]
    <a class="share bottom" href="#" aria-haspopup="true" aria-controls="gato-share-panel" data-gato-share-link="${gf.absoluteUrl(content.link)}" data-gato-share-subject="${content.title!} ${content.subtitle!}" data-gato-share-text="Sponsored by The Wittliff Collections: ${content.title!} ${content.subtitle!}" data-gato-share-image="${gf.filterUrl(content.image)}"><i class="fa fa-share-square-o" aria-hidden="true"></i> Share</a>
    [#if content.type == 'event']
      [#if content.rsvp?has_content]
        <a class="rsvp bottom" href="${gf.filterUrl(content.rsvp)}"><i class="fa fa-envelope-o" aria-hidden="true"></i> RSVP</a>
      [/#if]
      [#if content.eventlink?has_content]
        <a class="add bottom" href="${content.eventlink}.ics"><i class="fa fa-calendar" aria-hidden="true"></i> Add to Calendar</a>
      [/#if]
      <a class="all bottom" href="${gf.filterUrl('/wittliff/events')}">All Events <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
    [#else]
      <a class="all bottom" href="${gf.filterUrl('/wittliff/exhibitions')}">All Exhibitions <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
    [/#if]
  </div>
</div>

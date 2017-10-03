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
    <div class="typeheader">
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
      <span class="title" data-max-lines="3">${content.title}</span>
      [#if content.subtitle?has_content]<div class="subtitle" data-max-lines="2">${content.subtitle}</div>[/#if]
    </h2>
    [#if content.type == 'event' || content.type == 'exhibition']
    <div class="dates">
      [#if content.type == 'exhibition']
        <span class="start">${content.start?string['MMM d']}</span>
        <span class="separator">-</span>
        <span class="end">${content.end?string['MMM d']}</span>
      [#else]

      [/#if]
    </div>
    [/#if]
    <a class="share" href="#"><i class="fa fa-share-square-o" aria-hidden="true"></i> Share</a>
    [#if content.type == 'event']
      <a class="all" href="${gf.filterUrl('/wittliff/events')}">All Events <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
    [#else]
      <a class="all" href="${gf.filterUrl('/wittliff/exhibitions')}">All Exhibitions <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
    [/#if]
  </div>
</div>

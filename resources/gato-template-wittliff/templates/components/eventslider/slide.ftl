[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#include "/gato-template/templates/includes/section.ftl"]
[#if !(ctx.barsonly!false)]

<div class="eventslider-slide">
  <div class="eventslider-image ${gf.getImgWideOrTall(content.image, 2.2)}">
    [#if ctx.isFirst]
      <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}" />
    [#else]
      <img data-src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" data-srcset="${gf.getSrcSet(content.image)}" width="${gf.getImgWidth(content.image)?c}" height="${gf.getImgHeight(content.image)?c}" />
    [/#if]
  </div>
  <div class="eventslider-panel">
    <div class="eventslider-panelcontent">
      <div class="typeheader">
        [#if content.type == 'exhibition']
          Featured Exhibition
        [#elseif content.type == 'traveling']
          Traveling Exhibition
        [#elseif content.type == 'event']
          Featured Event
        [#elseif content.type == 'permanent']
          Permanent Exhibition
        [#elseif content.type == 'ongoing']
          Ongoing
        [#elseif content.type == 'online']
          Online Exhibition
        [#elseif content.type == 'news']
          News
        [/#if]
      </div>
      <h2><a href="${gf.filterUrl(content.link)}">
        <span class="title">${content.title!}</span>
        [#if content.subtitle?has_content]<div class="subtitle">${content.subtitle}</div>[/#if]
      </a></h2>
      [#if content.type == 'event' || content.type == 'exhibition' || content.type == 'traveling' || content.type == 'news']
      <div class="dates">
        [#if (content.type == 'exhibition' || content.type == 'traveling') && content.start?has_content]
          [#if .now > content.start?datetime && (!content.end?has_content || content.end?datetime > .now)]
            <span class="start">Now</span>
          [#else]
            <span class="start">${content.start?string['MMM d, yyyy']}</span>
          [/#if]
          [#if content.end?has_content]
            <span class="separator">-</span>
            <span class="end">${content.end?string['MMM d, yyyy']}</span>
          [/#if]
        [#elseif (content.type == 'event' || content.type == 'news') && content.start?has_content]
          <span class="date">${content.start?string['MMM d, yyyy']}</span>
          [#if content.type == 'event']
            <span class="separator">/</span>
            <span class="time">${gf.formatTime(content.start)}</span>
          [/#if]
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
      [#elseif content.type == 'exhibition' || content.type == 'permanent' || content.type == 'ongoing' || content.type == 'traveling']
        <a class="all bottom" href="${gf.filterUrl('/wittliff/exhibitions')}">All Exhibitions <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      [#elseif content.type == 'online']
        <a class="all bottom" href="${gf.filterUrl('/wittliff/exhibitions/Online_exhibitions')}">Online Exhibitions <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      [#elseif content.type == 'news']
        <a class="all bottom" href="${gf.filterUrl('/wittliff/about/news/news-releases')}">All News <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      [/#if]
    </div>
  </div>
</div>

[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]

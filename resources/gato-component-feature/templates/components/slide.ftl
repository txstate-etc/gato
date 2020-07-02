[#if !(ctx.barsonly!false)]
  [#assign active = false]
  [#if ctx.slideactive?has_content && ctx.slideactive == "active"]
    [#assign active = true]
  [/#if]
  <div class="slide ${ctx.colorClass!}" id="slidepanel${gf.uuidToHtmlId(content.@id)}" tabindex="${active?then(0,-1)}" role="tabpanel" tabindex="${active?then("0", "-1")}" aria-labelledby="slidetab${gf.uuidToHtmlId(content.@id)}">
    <div class="slide-content">
      [#if content.link?has_content]
        <a class="slide-link" href="${gf.filterUrl(content.link!)}" tabindex="${active?then(0,-1)}">
      [/#if]
      [#assign left = (content.imagecropleft!0.0)?number]
      [#assign right = (content.imagecropright!0.0)?number]
      [#assign top = (content.imagecroptop!0.0)?number]
      [#assign bottom = (content.imagecropbottom!0.0)?number]
      <div class="slide-image ${gf.getImgWideOrTall(content.image, 1.78)}">
        <img ${active?then("", "data-")}src="${gf.getImgDefault(content.image, left, right, top, bottom, ctx.aspectratio)}" ${active?then("", "data-")}srcset="${gf.getSrcSet(content.image, left, right, top, bottom, ctx.aspectratio)}" class="bg" alt="${content.alttext!}"/>
      </div>
      [#if !gf.isEmptyString(content.title) || !gf.isEmptyString(content.subtext)]
        [#assign tidysubtext = gf.tidyHTML(cmsfn.decode(content).subtext!'')]
        <div class="caption">
          [#if content.title?has_content]<h3 class="title">${content.title}</h3>[/#if]
          [#if content.subtext?has_content]<p data-orig-text="${tidysubtext?html}" data-skip-truncation="${ctx.skiptruncation!'false'}">${tidysubtext}</p>[/#if]
        </div>
      [/#if]
      [#if content.link?has_content]
        </a>
      [/#if]
    </div>
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]

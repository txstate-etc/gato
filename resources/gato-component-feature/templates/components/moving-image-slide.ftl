[#if !(ctx.barsonly!false)]
  [#assign active = false]
  [#if ctx.slideactive?has_content && ctx.slideactive == "active"]
    [#assign active = true]
  [/#if]
  <div id="slidepanel${gf.uuidToHtmlId(content.@id)}" class="slide moving-image ${ctx.slideactive!''} ${ctx.colorClass!}" role="tabpanel" aria-hidden="${active?then("false", "true")}" aria-labelledby="slidetab${gf.uuidToHtmlId(content.@id)}">
    <div class="slide-content">
    [#if content.link?has_content]
      <a class="slide-link" href="${gf.filterUrl(content.link!)}" tabindex="${active?then(0,-1)}">
    [/#if]
    <div class="cropData" data-start-left="${content.startcropleft!'0'}"
                          data-start-top="${content.startcroptop!'0'}"
                          data-start-right="${content.startcropright!'0'}"
                          data-start-bottom="${content.startcropbottom!'0'}"
                          data-end-left="${content.endcropleft!'0'}"
                          data-end-top="${content.endcroptop!'0'}"
                          data-end-right="${content.endcropright!'0'}"
                          data-end-bottom="${content.endcropbottom!'0'}">
    </div>
    <div class="image-container">
      <img class="image" ${active?then("", "data-")}src="${gf.getImgDefault(content.image)}" ${active?then("", "data-")}srcset="${gf.getSrcSet(content.image)}" class="bg" alt="${content.alttext!}">
    </div>
    <div class="caption moving-image-caption">
      [#if !gf.isEmptyString(content.title)]<h3 class="title">${content.title!''}</h3>[/#if]
      [#if !gf.isEmptyString(content.subtext)]<p data-orig-text="${content.subtext!''}">${content.subtext!''}</p>[/#if]
    </div>

    [#if content.link?has_content]
      </a>
    [/#if]
    </div>
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Moving Image'}" cms:edit></div>
[/#if]

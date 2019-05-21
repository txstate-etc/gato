[#if !(ctx.barsonly!false)]
  <div class="slide ${ctx.slideactive!''} ${(!content.content?has_content && !content.link?has_content && !content.title?has_content)?string('emptycontent', '')}" id="slide${ctx.index}" style="background: url(${damfn.getAssetLink(content.bgimage)!}) no-repeat center center">
    <div class="slidecontent">
      [#if !gf.isEmptyString(content.title)]<h4>${content.title}</h4>[/#if]
      <div class="slidetext">${cmsfn.decode(content).content}</div>
      [#if content.link?has_content]
        <a href="${gf.filterUrl(content.link)}" class="slidelink ${content.linktext?has_content?string('','emptylink')}">${content.linktext!""}</a>
      [/#if]
    </div>
  </div>
[#else]
  <div class="slider-edit-bar" data-title="${content.title!'Slider Image'}" cms:edit></div>
[/#if]

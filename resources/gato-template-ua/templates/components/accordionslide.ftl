[#if !(ctx.barsonly!false)]
  <h2 class="accordion_toggle ${ctx.extraclass!}">
    [#assign safetitle = content.title?url]
    <img src="${gf.getImageHandlerBase()}/imagehandler/uaaccordiontext/${safetitle}.png?text=${safetitle}&amp;fgcolor=${ctx.fginactive}&amp;shcolor=${ctx.shinactive}" alt="${content.title}" class="acc_inactive_img"/>
    <img src="${gf.getImageHandlerBase()}/imagehandler/uaaccordiontext/${safetitle}.png?text=${safetitle}&amp;fgcolor=${ctx.fgactive}&amp;shcolor=${ctx.shactive}" alt="${content.title}" class="acc_active_img"/>
    <div class="extraoverlay"></div>
  </h2>
  <div class="accordion_content">
    [#if content.link?has_content]
      <a href="${gf.filterUrl(content.link)}" class="accordion_link"></a>
    [/#if]
    <div class="accordion_realcontent txst-styledcontent" style="background: url(${damfn.getAssetLink(content.bgimage)}) no-repeat top right">${cmsfn.decode(content).content!}</div>
    <div class="extraoverlay"></div>
  </div>
[/#if]


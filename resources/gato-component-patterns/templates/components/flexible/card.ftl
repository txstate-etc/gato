[#switch ctx.orientation]
  [#case "normal"]
    [#assign left = (content.squarecropleft!0.0)?number]
    [#assign right = (content.squarecropright!0.0)?number]
    [#assign top = (content.squarecroptop!0.0)?number]
    [#assign bottom = (content.squarecropbottom!0.0)?number]
    [#assign aspectratio = 1]
    [#break]

  [#case "wide"]
    [#assign left = (content.widecropleft!0.0)?number]
    [#assign right = (content.widecropright!0.0)?number]
    [#assign top = (content.widecroptop!0.0)?number]
    [#assign bottom = (content.widecropbottom!0.0)?number]
    [#assign aspectratio = 1.333]
    [#break]

  [#case "full"]
    [#assign left = (content.fullcropleft!0.0)?number]
    [#assign right = (content.fullcropright!0.0)?number]
    [#assign top = (content.fullcroptop!0.0)?number]
    [#assign bottom = (content.fullcropbottom!0.0)?number]  
    [#assign aspectratio = 1.777]
    [#break]

  [#default]
    [#assign left = (content.imagecropleft!0.0)?number]
    [#assign right = (content.imagecropright!0.0)?number]
    [#assign top = (content.imagecroptop!0.0)?number]
    [#assign bottom = (content.imagecropbottom!0.0)?number]  
    [#assign aspectratio = 1]

  [/#switch]

<!--Check for whitespace in alt text-->
[#if gf.isEmptyString(content.imageAlt)]
  [#assign altText = ""]
  [#else]
  [#assign altText = content.imageAlt]
[/#if]
<a href="${gf.filterUrl(content.link)}">
  <div class="card" style='background-image: url("${gf.getImgDefault(content.image, left, right, top, bottom, aspectratio)}")'>
    [#if content.caption?has_content]
    <div class="caption">
      <p>${content.caption!''}</p>
    </div>
    [/#if]
  </div>
</a>
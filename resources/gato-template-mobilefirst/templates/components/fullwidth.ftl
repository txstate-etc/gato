[#assign hasImage= (content.imageposition == "none")?then(false, true)]
<div cms:edit></div>
<div class="fullwidth ${hasImage?string(content.imageposition, 'noimage')} ${content.color!}">
  [#if content.imageposition == "left"]
    [@cms.area name="image" /]
  [/#if]
  [@cms.area name="content" /]
  [#if content.imageposition == "right"]
    [@cms.area name="image" /]
  [/#if]
</div>

[#if cmsfn.isEditMode()]
<div class="edit-textlink" cms:edit="bar"></div>
[/#if]
[#assign hasImage = false]
[#if content.includeImage == "hasImage"]
  [#assign hasImage = true]
  [#if content.isWide!false]
    [#assign left = (content.widecropleft!0.0)?number]
    [#assign right = (content.widecropright!0.0)?number]
    [#assign top = (content.widecroptop!0.0)?number]
    [#assign bottom = (content.widecropbottom!0.0)?number]
    [#assign aspectratio = 2.21]
  [#else]
    [#assign left = (content.squarecropleft!0.0)?number]
    [#assign right = (content.squarecropright!0.0)?number]
    [#assign top = (content.squarecroptop!0.0)?number]
    [#assign bottom = (content.squarecropbottom!0.0)?number]
    [#assign aspectratio = 1]
  [/#if]
  [#assign img = gf.getImgDefault(content.image, left, right, top, bottom, aspectratio)]
  [#assign mobileImg = gf.getImgDefault(content.image, (content.fullcropleft!0.0)?number, (content.fullcropright!0.0)?number, (content.fullcroptop!0.0)?number, (content.fullcropbottom!0.0)?number, 1.777)]
[/#if]
[#if hasImage && content.imageAlignment == "image-left"]
  <div class="textlink-image" style='background-image: url("${img}")'></div>
  <div class="mobile-textlink-image" style='background-image: url("${mobileImg}")'></div>
[/#if]
<div class="pattern-content text-link ${content.color!}">
  [#assign headerLevel = 2]
  [#if !gf.isEmptyString(content.title)]
    <h2 class="title">${content.title}</h2>
    [#assign headerLevel = 3]
  [/#if]
  [#if content.text?has_content]<div class="text">${gf.processRichTextLevel(cmsfn.decode(content).text, headerLevel)}</div>[/#if]
  [#if content.links?has_content]
    <div class="links">
      <ul>
      [#list cmsfn.children(content.links) as lnk]
        <li>
          <a href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
        </li>
      [/#list]
      </ul>
    </div>
  [/#if]
</div>
[#if hasImage && content.imageAlignment == "image-right"]
<div class="textlink-image" style='background-image: url("${img}")'></div>
<div class="mobile-textlink-image" style='background-image: url("${mobileImg}")'></div>
[/#if]
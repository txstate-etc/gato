[#if cmsfn.isEditMode()]
<div class="edit-textlink" cms:edit="bar"></div>
[/#if]
[#assign hasImage = false]
[#if content.includeImage?? && content.includeImage == "hasImage"]
  [#assign hasImage = true]
  [#-- square crop --]
  [#assign squareLeft = (content.squarecropleft!0.0)?number]
  [#assign squareRight = (content.squarecropright!0.0)?number]
  [#assign squareTop = (content.squarecroptop!0.0)?number]
  [#assign squareBottom = (content.squarecropbottom!0.0)?number]
  [#assign squareImg = gf.getImgDefault(content.image, squareLeft, squareRight, squareTop, squareBottom, 1)]

  [#-- wide crop --]
  [#assign wideLeft = (content.widecropleft!0.0)?number]
  [#assign wideRight = (content.widecropright!0.0)?number]
  [#assign wideTop = (content.widecroptop!0.0)?number]
  [#assign wideBottom = (content.widecropbottom!0.0)?number]
  [#assign wideImg = gf.getImgDefault(content.image, wideLeft, wideRight, wideTop, wideBottom, 1.6)]

  [#-- full crop --]
  [#assign fullLeft = (content.fullcropleft!0.0)?number]
  [#assign fullRight = (content.fullcropright!0.0)?number]
  [#assign fullTop = (content.fullcroptop!0.0)?number]
  [#assign fullBottom = (content.fullcropbottom!0.0)?number]
  [#assign fullImg = gf.getImgDefault(content.image, fullLeft, fullRight, fullTop, fullBottom, 2.3)]
[/#if]
[#if hasImage && content.imageAlignment == "image-left"]
  <div class="textlink-image squarecrop" style='background-image: url("${squareImg}")'></div>
  <div class="textlink-image widecrop" style='background-image: url("${wideImg}")'></div>
  <div class="textlink-image fullcrop" style='background-image: url("${fullImg}")'></div>
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
  <div class="textlink-image squarecrop" style='background-image: url("${squareImg}")'></div>
  <div class="textlink-image widecrop" style='background-image: url("${wideImg}")'></div>
  <div class="textlink-image fullcrop" style='background-image: url("${fullImg}")'></div>
[/#if]
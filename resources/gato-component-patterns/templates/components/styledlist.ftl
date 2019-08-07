[#assign columns = ((content.includeImage == "hasImage")?then(content.columnsWithImage, content.columnsNoImage))]
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[#if content.alphabetize!false]
  <div class="txst-khan-notice">
    List items are currently displayed in alphabetical order. Moving items in the editing environment
    will not have a visual effect.
  </div>
[/#if]
[/#if]
[#if content.includeImage == "hasImage"]
  [#assign left = (content.imagecropleft!0.0)?number]
  [#assign right = (content.imagecropright!0.0)?number]
  [#assign top = (content.imagecroptop!0.0)?number]
  [#assign bottom = (content.imagecropbottom!0.0)?number]
  [#assign img = gf.getImgDefault( content.image, left, right, top, bottom, true)]
  [#assign srcset = gf.getSrcSet( content.image, left, right, top, bottom, true)]
  [#assign imageClass="with-image"]
[/#if]
<div class="mobilefirst-pattern">
  <div class="pattern-content single title-type">
    <div class="centered">
      <h2 class="title">${content.title}</h2>
      <div class="styled-list-content">
        [#if content.includeImage == "hasImage" && content.imageAlignment == "image-left"]
          <div class="styled-list-image left">
          <img src="${img}" srcset="${srcset}" sizes="100vw" alt="${content.imageAlt}">
          </div>
        [/#if]
        [@cms.area name="list" contextAttributes={"alphabetize": content.alphabetize!false, "columns": columns}/]
        [#if content.includeImage == "hasImage" && content.imageAlignment == "image-right"]
          <div class="styled-list-image right">
            <img src="${img}" srcset="${srcset}" sizes="100vw" alt="${content.imageAlt}">
          </div>
        [/#if]
      </div>
    </div>
  </div>
</div>

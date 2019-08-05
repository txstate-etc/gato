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
<div class="mobilefirst-pattern">
  <div class="pattern-content single title-type">
    <h2 class="title">${content.title}</h2>
    [@cms.area name="list" contextAttributes={"alphabetize": content.alphabetize!false, "columns": columns}/]
  </div>
</div>

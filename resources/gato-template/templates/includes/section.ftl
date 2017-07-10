[#macro sectionLabel]
  [#assign title = content.title!]
  [#assign showBackground = content.showBackgroundColor!false]
  [#if content.title?has_content || showBackground]
  <div class="section-data" data-title="${title}" data-background="${showBackground?string('show', 'none')}"></div>
  [/#if]
  <div class="columns-container">
  <h3 class="section-title hidden"></h3>
  [#if cmsfn.isEditMode()]
    <div class="section-bar">
      [#nested]
    </div>
  [#else]
    [#nested]
  [/#if]
  </div>
[/#macro]
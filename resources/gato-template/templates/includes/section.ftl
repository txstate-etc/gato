[#macro sectionLabel cssClass=""]
  [#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
  <div cms:edit="bar"></div>
  [#if content.title?has_content]
    <h3 class="section-title">${content.title!}</h3>
  [/#if]
  [#if cmsfn.isEditMode()]
    <div class="section-bar">
      [#nested]
    </div>
  [#else]
    [#nested]
  [/#if]
[/#macro]

[#macro sectionLabel cssClass=""]
  [#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
  [#if cmsfn.isEditMode()]
    <div cms:edit="bar"></div>
  [/#if]
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

[#macro sectionLabel]
  [#local headerlevel = 2]
  [#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
  [#if cmsfn.isEditMode()]
    <div cms:edit="bar"></div>
  [/#if]
  [#if content.title?has_content]
    [#local headerlevel = 3]
    <h2 class="section-title">${content.title!}</h2>
  [/#if]
  [#if cmsfn.isEditMode()]
    <div class="section-bar">
      [#nested headerlevel]
    </div>
  [#else]
    [#nested headerlevel]
  [/#if]
[/#macro]

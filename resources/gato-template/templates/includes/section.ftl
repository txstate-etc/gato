[#macro sectionLabel editclass='section-bar']
  [#local headerlevel = 2]
  [#if cmsfn.isEditMode()]
    <div cms:edit="bar" class="${editclass}"></div>
  [/#if]
  [#if content.title?has_content]
    [#local headerlevel = 3]
    <h2 class="section-title ${content.titleAlign!'center'}">${content.title!}</h2>
  [/#if]
  [#nested headerlevel]
[/#macro]

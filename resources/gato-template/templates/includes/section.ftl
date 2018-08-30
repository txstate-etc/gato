[#macro sectionLabel editclass='section-bar']
  [#local headerlevel = 2]
  [#if cmsfn.isEditMode()]
    <div cms:edit="bar" class="${editclass}"></div>
  [/#if]
  [#if content.title?has_content]
    [#local headerlevel = 3]
    [#assign marginClass = content.text?has_content?then('has-text', '')]
    <h2 class="section-title ${content.titleAlign!'center'} ${marginClass}">${content.title!}</h2>
  [/#if]
  [#if content.text?has_content]
    <p class="section-text ${content.titleAlign!'center'}">${content.text}</p>
  [/#if]
  [#nested headerlevel]
[/#macro]

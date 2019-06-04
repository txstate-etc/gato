[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#macro sectionLabel editclass='section-bar']
  [#local headerlevel = 2]
  [#if cmsfn.isEditMode()]
    <div cms:edit="bar" class="${editclass}"></div>
  [/#if]
  [#if content.attachSection!false]
    [#if (ctx.hasThereBeenSectionWithTitleBefore)]
      [#assign offset=1]
      [#local headerlevel++]
    [/#if]
  [/#if]  
  [#if !gf.isEmptyString(content.title)]
    [#local headerlevel++]
    [#assign marginClass = content.text?has_content?then('has-text', '')]

    [@h2 offset=offset class="section-title ${content.titleAlign!'center'} marginClass"]${content.title!}[/@h2]
  [/#if]
  [#if content.text?has_content]
    <p class="section-text ${content.titleAlign!'center'}">${content.text}</p>
  [/#if]
  [#nested headerlevel]
[/#macro]

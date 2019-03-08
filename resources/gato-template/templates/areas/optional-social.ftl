[#include "/gato-template/templates/includes/sociallinks.ftl"]
[#if component?has_content]
  [#if cmsfn.isEditMode() && ctx.shownotice!true]
    <div class="gato-editor-notice">Using this site's social media links. Delete the Social Media Link below and the Texas State default social media links will appear.</div>
  [/#if]
  [@cms.component content=component/]
[#else]
  [#if cmsfn.isEditMode() && ctx.shownotice!true]
    <div class="gato-editor-notice">These are default Texas State social media links. To show your own, click "Customize Social Media Links".</div>
  [/#if]
  [@sociallinks cmsfn.contentByPath('/homepage-data/global-links/defaultSocial', 'gatoapps') ctx.icononly!false/]
  [#if cmsfn.isEditMode()]
  <div class="optionalsocial_add" cms:add="box"></div>
  [/#if]
[/#if]

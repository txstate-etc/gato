[#include "/gato-template/templates/includes/sociallinks.ftl"]
[#if component?has_content]
  <div class="optional-social">
    [#if cmsfn.isEditMode()]
      <div class="gato-editor-notice">Using custom social media links. Edit them to your liking or delete them to use Texas State's default social media links.</div>
    [/#if]
    [@cms.component content=component/]
  </div>
[#else]
  [@sociallinks cmsfn.contentByPath('/homepage-data/global-links/defaultSocial', 'gatoapps') ctx.icononly!false/]
  <div class="optionalsocial_add" cms:add="box"></div>
[/#if]

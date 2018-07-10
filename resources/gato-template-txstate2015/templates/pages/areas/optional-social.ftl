[#if components?has_content && components?size > 0 && gf.hasChildren(components[0].sociallinks)]
  <div class="optional-social">
    [#if cmsfn.isEditMode()]
      <div class="txst-khan-notice">Using custom social media links. Edit them to your liking or delete them to use Texas State's default social media links.</div>
    [/#if]
    [@cms.component content=components[0]/]
  </div>
[#else]
  [@cms.component content=cmsfn.contentByPath('/homepage-data/global-links/defaultSocial', 'gatoapps') editable=false /]
  <div class="optionalsocial_add" cms:add="box"></div>
[/#if]

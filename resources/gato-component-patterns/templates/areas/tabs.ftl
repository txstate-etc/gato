[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#if cmsfn.isEditMode()]
    [#list components as component]
      [@cms.component content=component contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 4)?string('feature_add','feature_max')}" cms:add="bar"></div>
[/#if]
[#assign textAlign = (ctx.overlayPosition == "center")?then('text-center', 'text-left')]
[#if !(ctx.barsonly!false) && components?has_content]
[#assign firstComponent = getFirstObject(components)]
<div class="mobilefirst-pattern fixed-height bottom">
  <div class="tabbed">
    <div class="image-overlay" style='background-image:  url(${gf.getImgDefault(firstComponent.image)})'></div>
    <div class="overlay-block title-type pattern-content ${ctx.overlayColor!color1} ${ctx.overlayPosition!'center'} ${textAlign}">
      <div class="overlay-tabs">
        <div class="links">
          <ul>
          [#list components as component ]
            <li class="tab"><a>${component.tabLink}</a></li>
          [/#list]             
          </ul>
        </div>
      </div>      
    [#list components as component ]
        [@cms.component content=component contextAttributes={"overlayPosition": ctx.overlayPosition, "overlayColor": ctx.overlayColor}/]
    [/#list]    
    </div>
  </div>
</div>
[/#if]
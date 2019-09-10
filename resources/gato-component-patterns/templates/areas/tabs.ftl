[#include "/gato-component-patterns/templates/includes/tabbed-logic.ftl"]
[#if cmsfn.isEditMode()]
    [#list components as component]
      [@cms.component content=component contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 4)?string('tabbed_add','tabbed_max')}" cms:add="bar"></div>
[/#if]
[#assign textAlign = (ctx.overlayPosition == "center")?then('text-center', 'text-left')]
[#if !(ctx.barsonly!false) && components?has_content]
[#assign firstComponent = getFirstObject(components)]
<div class="mobilefirst-pattern fixed-height bottom">
  <div class="tabbed">
    <div class="image-overlay desktop" style='background-image:  url(${gf.getImgDefault(ctx.desktopImage)})'></div>
    <div class="image-overlay mobile" style='background-image:  url(${gf.getImgDefault(ctx.mobileImage)})'></div>
    <div class="overlay-block title-type pattern-content ${ctx.overlayColor!color1} ${ctx.overlayPosition!'center'} ${textAlign}">
      <div class="overlay-tabs">
        <div class="links">
          <ul role="tablist">
          [#list components as component ]
            <li class="tab"><a id="tab${component.tabLink?replace(" ", "")}" tabindex=0 role="tab" aria-controls="panel${component.tabLink?replace(" ", "")}" aria-selected="${(component?index == 0)?then("true", "false")}">${component.tabLink}</a></li>
          [/#list]             
          </ul>
        </div>
      </div>
    <div class="panel-wrapper" aria-live="polite">  
    [#list components as component ]
        [@cms.component content=component contextAttributes={"overlayPosition": ctx.overlayPosition, "overlayColor": ctx.overlayColor}/]
    [/#list]
    </div>  
    </div>
  </div>
</div>
[/#if]
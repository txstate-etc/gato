[#include "/gato-component-patterns/templates/includes/tabbed-logic.ftl"]
[#if cmsfn.isEditMode()]
    [#list components as component]
      [@cms.component content=component contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 4)?string('tabbed_add','tabbed_max')}" cms:add="bar"></div>
[/#if]
[#assign textAlign = (ctx.overlayPosition == "center")?then('text-center', 'text-left')]
[#if !(ctx.barsonly!false) && components?has_content]
<div class="mobilefirst-pattern fixed-height bottom">
  <div class="tabbed">
    <div class="image-overlay desktop" style='background-image:  url(${gf.getImgDefault(ctx.desktopImage)})'></div>
    <div class="image-overlay mobile" style='background-image:  url(${gf.getImgDefault(ctx.mobileImage)})'></div>
    <div class="overlay-block title-type pattern-content ${ctx.overlayColor!color1} ${ctx.overlayPosition!'center'} ${textAlign}">
      <div class="overlay-tabs">
        <div class="links">
          <div class="tab-list" role="tablist">
          [#list components as component ]
            <button role="tab" id="tab${component.tabLink?replace(" ", "")}" class="${(component?is_first)?then("selected-tab", "")}" tabindex="${(component?is_first)?then("0", "-1")}" 
                aria-controls="panel${component.tabLink?replace(" ", "")}" aria-selected="${(component?index == 0)?then("true", "false")}" style="margin-left: ${(component?is_first)?then("10%", "-0")}">
              <span>${component.tabLink}</span>
            </button>
          [/#list]
          </div>
        </div>
      </div>
    <div class="panel-wrapper">
    [#list components as component ]
        [@cms.component content=component contextAttributes={"overlayPosition": ctx.overlayPosition, "overlayColor": ctx.overlayColor, "first": (component?is_first)?then("true","false")}/]
    [/#list]
    </div>  
    </div>
  </div>
</div>
[/#if]
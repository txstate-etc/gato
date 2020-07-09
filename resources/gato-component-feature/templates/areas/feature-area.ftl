[#if cmsfn.isEditMode()]
  <div class="slides-admin">
    [#list components as slide]
      [@cms.component content=slide contextAttributes={"barsonly": true} /]
    [/#list]
    <div class="${(components?size < 10)?string('feature_add','feature_max')}" cms:add="bar"></div>
  </div>
[/#if]
[#assign colorCount = gf.getTemplateColorCount(cmsfn.metaData(cmsfn.root(content, "mgnl:page"), "mgnl:template"))!7]
<div class="slideshow-wrapper">
  [#if components?size > 1]
    <div class="arrow-container">
      <button class="prev" tabindex="-1" aria-hidden="true"><i class="fa fa-angle-left"></i><span class="visuallyhidden">Previous Slide</span></button>
      <button class="next" tabindex="-1" aria-hidden="true"><i class="fa fa-angle-right"></i><span class="visuallyhidden">Next Slide</span></button>
    </div>
    <div class="nav-dots" role="tablist">
      [#list components as slide]
        [#if slide.title?has_content && !gf.isEmptyString(slide.title)]
          [#assign tabtitle = slide.title]
        [#elseif slide.alttext?has_content && !gf.isEmptyString(slide.alttext) ]
          [#assign tabtitle = slide.alttext]
        [#else]
          [#assign tabtitle = "Slide " + (slide_index + 1)]
        [/#if]
        <button role="tab" id="slidetab${gf.uuidToHtmlId(slide.@id)}" class="dot ${(slide_index == 0)?then("active", "")} btnSlideshowNav" tabindex="${(slide_index == 0)?then("0", "-1")}" aria-controls="slidepanel${gf.uuidToHtmlId(slide.@id)}" aria-selected="${(slide_index == 0)?then("true", "false")}">
          <span class="visuallyhidden">${tabtitle}</span>
        </button>
      [/#list]
    </div>
  [/#if]
  [#if components?size > 0]
    <button class="btnPauseSlider">
      <i class="fa fa-pause" aria-hidden="true"></i>
      <span class="visuallyhidden">Pause Slider</span>
    </button>
  [/#if]
  <div class="visuallyhidden pause-status" aria-live="polite"></div>
  <div class="slides">
    [#assign aspectratio = 16.0/9.0]
    [#list components as slide]
      [#assign colorClass = ctx.colorClass /]
      [#if !colorClass?matches("color[1-7]")]
        [#assign colorClass = "color${(slide_index % colorCount)+1}" /]
      [/#if]
      [@cms.component content=slide contextAttributes={"slideactive": (slide_index == 0)?string("active", ""), "colorClass": colorClass, "aspectratio": aspectratio} editable=false /]
    [/#list]
  </div>
  <div aria-hidden="true" class="keyboard-instructions">Use Left and Right Arrow Keys to Interact with Slideshow</div>
</div>

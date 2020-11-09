[#list components as component]
  [#assign hasBackgroundClass = (component.showBackgroundColor!false)?string(' has-background','')]
  [#assign cardLayoutClass = gf.isCardSection(component)?string(' card-layout', '')]
  [#assign patternClass = gf.isPattern(component)?then(' pattern', '')]

  <div id="${gf.htmlId(component)}" class="gato-section-full ${(ctx.hideSidebar!false)?then('full-width', '')} ${hasBackgroundClass}${cardLayoutClass}${patternClass}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [@cms.component content=component contextAttributes={"hideSidebar":true}/]
      </div>
    </div>
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="gato-section-full edit-bar ${(ctx.hideSidebar!false)?then('full-width', '')}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        <div class="add-layout" cms:add="box"></div>
      </div>
    </div>
  </div>
[/#if]
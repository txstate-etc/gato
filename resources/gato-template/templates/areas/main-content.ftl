[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign mainContentClass = hideSidebar?string('full-width','')]
[#list components as component]
  [#if component.showBackgroundColor!false]
    [#assign hasBackgroundClass = 'has-background']
  [#else]
    [#assign hasBackgroundClass = '']
  [/#if]
  <div class="gato-section-full ${mainContentClass} ${hasBackgroundClass} ${gf.isCardSection(component)?string('card-layout', '')}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [@cms.component content=component /]
      </div>
    </div>
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="gato-section-full ${mainContentClass}">
    <div class="gato-section-centered">
      <div class="gato-section">
        <div class="mainContent_add" cms:add="box"></div>
      </div>
    </div>
  </div>
[/#if]

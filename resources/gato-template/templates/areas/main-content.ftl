[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign mainContentClass = hideSidebar?string(' full-width','')]
[#list components as component]
  [#assign hasBackgroundClass = (component.showBackgroundColor!false)?string(' has-background','')]
  [#assign cardLayoutClass = gf.isCardSection(component)?string(' card-layout', '')]
  <div class="gato-section-full${mainContentClass}${hasBackgroundClass}${cardLayoutClass}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [#if cmsfn.isEditMode() && hasBackgroundClass == " has-background"]
          <div class="txst-khan-notice background-color-warning">
            Background color will not show up if this section is next to the sidebar.
          </div>
        [/#if]
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

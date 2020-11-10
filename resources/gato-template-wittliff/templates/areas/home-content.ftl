[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#list components as component]
  [#assign hasBackgroundClass = (component.showBackgroundColor!false)?string(' has-background','')]
   [#assign cardLayoutClass = gf.isCardSection(component)?string(' card-layout', '')]
  <div id="${gf.htmlId(component)}" class="gato-section-full full-width ${cardLayoutClass}${hasBackgroundClass}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [#if cmsfn.isEditMode() && hasBackgroundClass == " has-background"]
          <div class="txst-khan-notice background-color-warning">
            Background color will not show up if this section is next to the sidebar.
          </div>
        [/#if]
        [@cms.component content=component contextAttributes={"hasThereBeenSectionWithTitleBefore": hasThereBeenSectionWithTitleBefore(components, component?counter)!false}/]
      </div>
    </div>
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="gato-section-full full-width">
    <div class="gato-section-centered">
      <div class="gato-section">
        <div class="mainContent_add" cms:add="box"></div>
      </div>
    </div>
  </div>
[/#if]
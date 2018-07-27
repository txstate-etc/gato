[#list components as component]
  [#assign hasBackgroundClass = (component.showBackgroundColor!false)?string(' has-background','')]
  [#assign cardLayoutClass = gf.isCardSection(component)?string(' card-layout', '')]
  <div class="gato-section-full full-width ${hasBackgroundClass}${cardLayoutClass}">
    <div class="gato-section eq-parent">
      [@cms.component content=component /]
    </div>
  </div>
[/#list]
[#if cmsfn.isEditMode()]
  <div class="mobilefirst_component_add" cms:add="box"></div>
[/#if]

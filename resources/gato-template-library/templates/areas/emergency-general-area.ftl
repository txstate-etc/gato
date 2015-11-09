<h3 class="general_emergency">
[#if cmsfn.isEditMode() || (component.content)?has_content]
    [#if component??]
        [@cms.component content=component/]
    [/#if]
[/#if]
[#if cmsfn.isEditMode()]
  <div class="genEmergency_add" cms:add="box"></div>
[/#if]
</h3>
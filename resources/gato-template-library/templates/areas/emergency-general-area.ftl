<h3 class="general_emergency">
[#if cmsfn.isEditMode() || (component.content)?has_content]
    [#if component??]
        [@cms.component content=component/]
    [/#if]
[/#if]
</h3>
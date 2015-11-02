[#if cmsfn.isEditMode() || (component.content)?has_content]
    <h3 class="hours_emergency">
        [#if component??]
            [@cms.component content=component/]
        [/#if]
    </h3>
[/#if]
[#if cmsfn.isEditMode() || (component.content)?has_content]
    <h3 class="hours_emergency">
        [@cms.component content=component/]
    </h3>
[/#if]
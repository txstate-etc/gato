[#if cmsfn.isEditMode() || (component.content)?has_content]
    <h3 class="hours_emergency">
        [#if component??]
            [@cms.component content=component/]
        [/#if]
        [#if cmsfn.isEditMode()]
            <br>
            <div class="emergencyHours_add" cms:add="box"></div>
        [/#if]
    </h3>
[/#if]
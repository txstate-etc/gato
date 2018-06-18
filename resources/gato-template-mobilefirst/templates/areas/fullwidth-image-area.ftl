[#if component?has_content]
    [@cms.component content=component /]
[#elseif cmsfn.isEditMode()]
    <div class="image_add" cms:add="bar"></div>
[/#if]

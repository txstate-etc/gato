[#if component?has_content]
    [@cms.component content=component /]
[#elseif cmsfn.isEditMode()]
    <div class="content_add" cms:add="bar"></div>
[/#if]

[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#if component?has_content]
    [@cms.component content=component /]
[#elseif cmsfn.isEditMode()]
    <div class="parentOrg_add" cms:add="bar"></div>
[/#if]

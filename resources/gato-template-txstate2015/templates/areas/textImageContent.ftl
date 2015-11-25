[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#if component?has_content]
    [@cms.component content=component /]
[#else]
    <div class="content_add" cms:add="bar"></div>
[/#if]

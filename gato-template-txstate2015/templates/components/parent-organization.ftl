[#include "/gato-template/templates/includes/head.ftl"]
[#assign homePageContent = cmsfn.contentByPath(homepage)]
[#assign homeLink = cmsfn.link(homepage)]

[#if homePageContent.parentOrganization??]
    [#assign parent_url = content.url!"#"]
    [#assign parent_org = content.parent_name!""]
    
    [#if parent_org?length gt 0]
    <p class="parent_org">
            <a href="${parent_url}">${parent_org}</a>
    </p>
    [/#if]
[/#if]
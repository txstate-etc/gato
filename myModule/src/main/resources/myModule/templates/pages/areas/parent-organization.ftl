[#assign parent_url = content.parent_org_url!"#"]
[#assign parent_org = content.parent_organization!""]

[#if parent_org?length gt 0]
<p class="parent_org">
        <a href="${parent_url}">${parent_org}</a>
</p>
[/#if]
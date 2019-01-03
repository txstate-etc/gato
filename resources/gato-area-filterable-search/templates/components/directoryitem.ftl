<div class="listitem">
[#if content.link?has_content]
  <a href="${gf.filterUrl(content.link)}">
[/#if]
<div class="listitem-title">
  ${content.title!} ${content.firstname!} ${content.lastname!}
</div>
[#if content.link?has_content]
  </a>
[/#if]
[#if content.description?has_content]
  <div class="listitem-description">
    ${cmsfn.decode(content).description}
  </div>
[/#if]
[#if content.email?has_content]
  Email: ${content.email}
[/#if]
[#if content.office?has_content]
  Office: ${content.office}
[/#if]
[#if content.phone?has_content]
  Phone: ${content.phone}
[/#if]
</div>

[#assign colorClass = ctx.colorClass!"color1" /]
[#assign prefix = 'fa']
[#if content.prefix??]
    [#assign prefix = content.prefix]
[/#if]
<a href="${gf.filterUrl(content.link)}" class="${colorClass}">
    <div class="icontext-pattern-icon">
      <i class="${prefix} ${content.icon!'fa-graduation-cap'}" aria-hidden="true"></i>
    </div>
    <div class="icontext-pattern-title">${content.title}</div>
</a>

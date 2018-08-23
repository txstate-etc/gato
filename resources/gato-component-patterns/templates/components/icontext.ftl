[#assign colorClass = ctx.colorClass!"color1" /]
<a href="${gf.filterUrl(content.link)}" class="${colorClass}">
    <div class="icontext-pattern-icon">
      <i class="fa ${content.icon!'fa-graduation-cap'}" aria-hidden="true"></i>
    </div>
    <div class="icontext-pattern-title">${content.title}</div>
</a>

[#include "/gato-template/templates/includes/commonmacros.ftl"]
<a href="${gf.filterUrl(content.link)}" class=${content.color}>
    <div class="icontext-pattern-icon">
      <i class="fa ${content.icon!'fa-graduation-cap'}" aria-hidden="true"></i>
    </div>
    [@h2 class="icontext-pattern-title"]${content.title}[/@h2]
</a>

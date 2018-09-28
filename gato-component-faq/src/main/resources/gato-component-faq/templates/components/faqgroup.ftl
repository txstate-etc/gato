[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign depth = ctx.depth]
<li class="gato-faq-group shown" role="treeitem" aria-expanded="true">
[@h2 offset=depth class='gato-faq-group-title gato-faq-header']<a href="#">
  <i class="fa fa-caret-right" aria-hidden="true"></i>
  ${content.title}</a>[/@h2]
  <ul class="gato-faq-group-children" role="group" aria-hidden="false">
    [@cms.area name="faqgroup" contextAttributes={"depth": depth+1}/]
  </ul>
</li>

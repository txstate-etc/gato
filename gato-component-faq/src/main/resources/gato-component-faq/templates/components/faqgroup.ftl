[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign depth = ctx.depth]
<li class="gato-faq-group shown">
[@h2 offset=depth class='gato-faq-group-title gato-faq-header gato-accordion-header']<a href="#" aria-haspopup="true" aria-expanded="true" aria-controls="${gf.uuidToHtmlId(content.@id)}">
  <i class="fa fa-caret-right" aria-hidden="true"></i>
  ${content.title}</a>[/@h2]
  <ul class="gato-faq-group-children" id="${gf.uuidToHtmlId(content.@id)}">
    [@cms.area name="faqgroup" contextAttributes={"depth": depth+1}/]
  </ul>
</li>

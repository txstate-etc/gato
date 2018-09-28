[#if !ctx.request.getAttribute('faqButtonsAdded')!false]
  <div class="gato-faq-expand-collapse">
    <a href="#" id="gato-expand-all-faqs">Expand</a> or
    <a href="#" id="gato-collapse-all-faqs">Collapse</a> all.
  </div>
  ${ctx.request.setAttribute('faqButtonsAdded', true)}
[/#if]
<ul class="gato-faq-hierarchy" role="tree">
[@cms.area name="faqTree" contextAttributes={"depth": 0}/]
</ul>

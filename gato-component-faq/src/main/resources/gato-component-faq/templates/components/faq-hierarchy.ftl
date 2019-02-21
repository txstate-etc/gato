[#if !ctx.request.getAttribute('faqButtonsAdded')!false]
  <div class="gato-faq-expand-collapse">
    <a href="#" id="gato-expand-all-faqs">Expand</a> or
    <a href="#" id="gato-collapse-all-faqs">Collapse</a> all.
  </div>
  ${ctx.request.setAttribute('faqButtonsAdded', true)}
[#else]
  <div class="gato-faq-spacer">
  </div>
[/#if]
<ul class="gato-faq-hierarchy">
[@cms.area name="faqTree" contextAttributes={"depth": 0}/]
</ul>

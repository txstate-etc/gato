[#if !ctx.request.getAttribute('accordionloaded')!false]
  <a href="#" id="gato-page-accordion-toggle">Expand All Content</a>
  ${ctx.request.setAttribute('accordionloaded', true)}
[/#if]
<div class="gato-faq-expand-collapse">
  <a href="#" class="gato-faq-toggle">
    <span class="action">Expand</span>
    <span class="visuallyhidden">FAQ List</span>
  </a>
</div>
<ul class="gato-faq-hierarchy">
[@cms.area name="faqTree" contextAttributes={"depth": 0}/]
</ul>

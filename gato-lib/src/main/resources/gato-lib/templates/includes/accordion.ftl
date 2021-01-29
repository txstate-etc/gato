[#if !ctx.request.getAttribute('accordionloaded')!false]
  ${ctx.request.setAttribute('accordionloaded', true)}
  <a href="#" id="gato-accordion-toggle">Expand All Content</a>
[/#if]

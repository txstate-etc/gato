[#if !ctx.request.getAttribute('accordionloaded')!false]
  ${ctx.request.setAttribute('accordionloaded', true)}

  <div class="gato-accordion-expand-collapse">
    <a href="#" id="gato-accordion-expand-all">Expand</a> or
    <a href="#" id="gato-accordion-collapse-all">Collapse</a> all.
  </div>
[/#if]

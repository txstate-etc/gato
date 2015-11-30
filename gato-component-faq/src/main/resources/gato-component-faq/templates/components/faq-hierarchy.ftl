[#macro faqItem node depth]
  <div class="txst-faqitem" style="margin-left:${20*depth}px">
    <h2 class="txst-faqitem-question">
      <a href="#">
        [#if depth > 0]<span class="caret fa fa-caret-right"></span>[/#if]
        ${node.question}</a>
    </h2>
    <div class="txst-faqitem-answer">${node.answer}</div>
  </div>
[/#macro]

[#macro faqGroup node depth]
  <h2 class="txst-faq-group-title" style="margin-left:${20*depth}px"><a href="#">${node.title}</a></h2>
  <div class="txst-faq-group">
    [#list node.children as child]
      [@faqNode child depth+1 /]
    [/#list]
  </div>
[/#macro]

[#macro faqNode node depth]
  [#if node.nodetype == "group"]
    [@faqGroup node depth /]
  [#else]
    [@faqItem node depth /]
  [/#if]
[/#macro]

<div class="faq-hierarchy">
[#if !ctx.request.getAttribute('faqButtonsAdded')!false]
  <div class="gato-faq-expand-collapse">
    <a href="#" id="txst-expand-all-faqs">Expand</a> or
    <a href="#" id="txst-collapse-all-faqs">Collapse</a> all.
  </div>
  ${ctx.request.setAttribute('faqButtonsAdded', true)}
[/#if]
[#list model.nodes as node]
  [@faqNode node 0 /]
[/#list]
</div>

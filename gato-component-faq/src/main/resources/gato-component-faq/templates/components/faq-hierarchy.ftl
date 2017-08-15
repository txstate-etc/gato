[#macro faqItem node depth]
  <li class="gato-faqitem" role="treeitem" aria-expanded="false">
    <a href="#" class="gato-faqitem-question">
      <i class="fa fa-caret-right" aria-hidden="true"></i>
      ${node.question}</a>
    <div class="gato-faqitem-answer" role="group" aria-hidden="true"><div role="treeitem">${node.answer}</div></div>
  </li>
[/#macro]

[#macro faqGroup node depth]
  <li class="gato-faq-group" role="treeitem" aria-expanded="false">
    <a href="#" class="gato-faq-group-title">
      <i class="fa fa-caret-right" aria-hidden="true"></i>
      ${node.title}</a>
    <ul class="gato-faq-group-children" role="group" aria-hidden="true">
      [#list node.children as child]
        [@faqNode child depth+1 /]
      [/#list]
    </ul>
  </li>
[/#macro]

[#macro faqNode node depth]
  [#if node.nodetype == "group"]
    [@faqGroup node depth /]
  [#else]
    [@faqItem node depth /]
  [/#if]
[/#macro]

[#if !ctx.request.getAttribute('faqButtonsAdded')!false]
  <div class="gato-faq-expand-collapse">
    <a href="#" id="gato-expand-all-faqs">Expand</a> or
    <a href="#" id="gato-collapse-all-faqs">Collapse</a> all.
  </div>
  ${ctx.request.setAttribute('faqButtonsAdded', true)}
[/#if]
<ul class="gato-faq-hierarchy" role="tree">
[#list model.nodes as node]
  [@faqNode node 0 /]
[/#list]
</ul>

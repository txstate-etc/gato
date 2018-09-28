[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign depth = ctx.depth]
<li class="gato-faqitem" role="treeitem" aria-expanded="false">
  [@h2 offset=depth class='gato-faqitem-question gato-faq-header']
  <a href="#">
    <i class="fa fa-caret-right" aria-hidden="true"></i>
    ${content.question}
  </a>
  [/@h2]
  <div class="gato-faqitem-answer" role="group" aria-hidden="true">
    <div role="treeitem" id="${gf.uuidToHtmlId(content['jcr:uuid'])}">
      ${gf.processRichTextLevel(cmsfn.decode(content).answer, (ctx.headerlevel!2)+depth+1)}
    </div>
  </div>
</li>

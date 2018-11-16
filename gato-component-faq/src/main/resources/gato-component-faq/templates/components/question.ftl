[#include "/gato-template/templates/includes/commonmacros.ftl"]
[#assign depth = ctx.depth]
<li class="gato-faqitem">
  [@h2 offset=depth class='gato-faqitem-question gato-faq-header']
  <a href="#" aria-haspopup="true" aria-expanded="false">
    <i class="fa fa-caret-right" aria-hidden="true"></i>
    ${content.question}
  </a>
  [/@h2]
  <div id="${gf.uuidToHtmlId(content['jcr:uuid'])}" class="gato-faqitem-answer">
    ${gf.processRichTextLevel(cmsfn.decode(content).answer, (ctx.headerlevel!2)+depth+1)}
  </div>
</li>

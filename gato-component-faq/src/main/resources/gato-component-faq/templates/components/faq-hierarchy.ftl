[#include "/gato-template/templates/includes/component.ftl"]
[@templatecomponent]
  [#if !faqButtonsAdded!false]
    <a href="#" id="txst-expand-all-faqs">Expand</a>
    or
    <a href="#" id="txst-collapse-all-faqs">Collapse</a>
    all.
    [#global "faqButtonsAdded" = true]
  [/#if]
  ${model.html}
[/@templatecomponent]

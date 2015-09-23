[#include "/gato-template/templates/includes/component.ftl"]

[@templatecomponent]
  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]
  [@cms.area name="images"/]
  [#include "/gato-lib/templates/includes/pswpmodal.ftl"]
[/@templatecomponent]

[#include "/gato-template/templates/includes/component.ftl"]
[#assign cmsUtil = JspTaglibs["cmsUtilTaglib"]]

[#assign startLevel = (content.startLevel!"1")?number]
[#if startLevel == 0][#assign startLevel = 1][/#if]

[#assign endLevel = (content.endLevel!"999")?number]
[#if endLevel == 0][#assign endLevel = 1][/#if]

[@templatecomponent]
  [#if (content.title!"")?length > 0]
    <h2>${content.title}</h2>
  [/#if]

  [@cmsUtil.simpleNavigation expandAll="show" startLevel=startLevel endLevel=endLevel+1 /]
[/@templatecomponent]

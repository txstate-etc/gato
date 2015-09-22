[#include "/gato-template/templates/includes/component.ftl"]
[#assign cmsUtil = JspTaglibs["cmsUtilTaglib"]]

[#macro addPageToList node levelsToGo]
  [#assign nameList = nameList + [node.title]]
[/#macro]

[@templatecomponent]
  [#if (content.title!"")?length > 0]
    <h2>${content.title}</h2>
  [/#if]

  [#if content.alphabetical!false]
    <ul>
    [#list model.sortedTitles as title]
      <li><a href="${model.getUrl(title)}">${title}</a></li>
    [/#list]
    </ul>
  [#else]
    [@cmsUtil.simpleNavigation expandAll="show" startLevel=content.startPage?number endLevel=content.startPage?number+content.depth?number /]
  [/#if]

[/@templatecomponent]

[#include "/gato-template/templates/includes/component.ftl"]

[#macro processPage node depth]
  [#if !(node.hideInNav!false)]
    [#local children = cmsfn.children(node, "mgnl:page")]
    <li class="sitemap-item">
      <a href="${cmsfn.link(node)}">${gf.nodeTitle(node)}</a>
      [#if children?size > 0 && depth > 0]
        <ul>
        [#list children as child]
          [@processPage child depth-1 /]
        [/#list]
        </ul>
      [/#if]
    </li>
  [/#if]
[/#macro]

[@templatecomponent]
  [#if (content.title!"")?length > 0]
    <h2>${content.title}</h2>
  [/#if]

  [#if content.alphabetical!false]
    <ul>
    [#list model.sortedNodes as node]
      [#assign nodeContentMap = cmsfn.asContentMap(node)]
      <li><a href="${cmsfn.link(node)}">${gf.nodeTitle(node)}</a></li>
    [/#list]
    </ul>
  [#else]
    [#assign startingNode = cmsfn.ancestors(content, "mgnl:page")[content.startPage?number-1]]

    <ul class="sitemap-list">
      [#list cmsfn.children(startingNode, "mgnl:page") as child]
        [@processPage child content.depth?number-1 /]
      [/#list]
    </ul>
  [/#if]

[/@templatecomponent]

[#macro processPage node depth]
  [#local pagePublished = true]
  [#if cmsfn.metaData(node, "mgnl:activationStatus")?number < 1]
    [#local pagePublished = false]
  [/#if]
  [#if !(node.hideInNav!false)]
    [#local children = cmsfn.children(node, "mgnl:page")]
    <li class="sitemap-item ${(children?size > 0)?string('open','leaf')}">
      [#if cmsfn.isAuthorInstance() && !pagePublished]
        <span class="not-published">${gf.nodeTitle(node)}</span>
      [#else]
        <a href="${cmsfn.link(node)}">${gf.nodeTitle(node)}</a>
      [/#if]
      [#if gf.hasNavChildren(node) && depth > 0]
        <ul class="level${depth+1}">
        [#list children as child]
          [@processPage child depth-1 /]
        [/#list]
        </ul>
      [/#if]
    </li>
  [/#if]
[/#macro]

[#if (content.title!"")?length > 0]
  <h2>${content.title}</h2>
[/#if]
[#if cmsfn.isAuthorInstance()]
  <div class="txst-khan-notice">
    Italicized items represent unpublished pages and will not be visible on the public site.
  </div>
[/#if]
[#if content.alphabetical!false]
  <ul>
  [#list model.sortedNodes as node]
    [#assign nodeContentMap = cmsfn.asContentMap(node)]
    [#local pagePublished = true]
    [#if cmsfn.metaData(node, "mgnl:activationStatus")?number < 1]
      [#local pagePublished = false]
    [/#if]
    <li class="sitemap-item">
      [#if cmsfn.isAuthorInstance() && !pagePublished]
        <span class="not-published">${gf.nodeTitle(node)}</span>
      [#else]
        <a href="${cmsfn.link(node)}">${gf.nodeTitle(node)}</a>
      [/#if]
    </li>
  [/#list]
  </ul>
[#else]
  [#assign startingNode = cmsfn.ancestors(content, "mgnl:page")[content.startPage?number-1]]

  <ul class="sitemap-list level1">
    [#list cmsfn.children(startingNode, "mgnl:page") as child]
      [#assign depth = (content.depth!"1")?number-1]
      [@processPage child depth /]
    [/#list]
  </ul>
[/#if]


[#assign root = cmsfn.root(content, "mgnl:page")! ] 
[#assign depth = 0]
[#macro listNodes node rootNode depth]
    [#if node.title?has_content && node != rootNode]
      [#if cmsfn.metaData(node, "mgnl:activationStatus")?number > 0]
        <div class="${(gf.hasNavChildren(node))?then("has-children", "")}"><a href="${cmsfn.link(node)}">${node.title}</a></div>
      [/#if]
    [/#if]

    [#if cmsfn.children(node, "mgnl:page")?size > 0]
        <ul class="nested">
        [#list cmsfn.children(node, "mgnl:page") as childNode ]
          [#if !childNode.hideInNav!false]
            <li>
              [#assign newdepth = depth+1]
              [@listNodes childNode rootNode newdepth/]
            </li>
          [/#if]
        [/#list]
        </ul>
    [/#if]
[/#macro]
<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="sitemap">
        <ul class="topLevel">
        [#list cmsfn.children(root, "mgnl:page") as child]
          [#assign published = true]
          [#if cmsfn.metaData(child, "mgnl:activationStatus")?number < 1]
            [#assign published = false]
          [/#if]
          [#if published && !child.hideInNav!false]
            <li>
              [#if child.title?has_content]
                  <h2>${child.title}</h2>
              [/#if]
              [@listNodes child root 1][/@listNodes]
            </li>
          [/#if]
        [/#list]
        </ul>
    </div>
  </div>
</div>
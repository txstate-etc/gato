[#assign root = cmsfn.root(content, "mgnl:page")! ] 
[#assign depth = 0]
[#macro listNodes node rootNode depth]
    [#if node.title?has_content && node != rootNode]
      <div class="${(cmsfn.children(node, "mgnl:page")?size > 1)?then("has-children", "")}"><a href="${cmsfn.link(node)}">${node.title}</a></div>
    [/#if]

    [#if cmsfn.children(node, "mgnl:page")?size > 0]
        <ul class="nested">
        [#list cmsfn.children(node, "mgnl:page") as childNode ]
          <li>
            [#if !childNode.hideInNav!false]
                [#assign newdepth = depth+1]
                [@listNodes childNode rootNode newdepth/]
            [/#if]
          </li>
        [/#list]
        </ul>
    [/#if]
[/#macro]
<div class="gato-section-full">
  <div class="gato-section-centered">
    <div class="sitemap">
        <ul class="topLevel">
        [#list cmsfn.children(root, "mgnl:page") as child]
          <li>
            [#if child.title?has_content]
                <h2>${child.title}</h2>
            [/#if]
            [@listNodes child root 1][/@listNodes]
          </li>
        [/#list]
        </ul>
    </div>
  </div>
</div>
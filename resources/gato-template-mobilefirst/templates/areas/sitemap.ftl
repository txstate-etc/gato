[#assign root = cmsfn.root(content, "mgnl:page")! ] 
[#assign depth = 0]
[#macro listNodes node rootNode depth]
    [#if cmsfn.parent(node) == rootNode]
        [#if node.title?has_content]
            <h2>${node.title}</h2>
        [/#if]
    [/#if]
    [#if node.title?has_content && node != rootNode]
        <li class="${(depth % 2 == 0)?then('grey', 'white')}"><a href="${cmsfn.link(node)}">${node.title}</li></a>
    [/#if]

    [#if cmsfn.children(node, "mgnl:page")?size > 0]
        <ul>
        [#list cmsfn.children(node, "mgnl:page") as childNode ]
            [#if !childNode.hideInNav!false]
                [#assign newdepth = depth+1]
                [@listNodes childNode rootNode newdepth/]
            [/#if]
        [/#list]
        </ul>
    [/#if]
[/#macro]

<div class="sitemap">
    <ul class="topLevel">
        [@listNodes root root depth][/@listNodes]
    </ul>
</div>
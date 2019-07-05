[#assign rootNode = cmsfn.nodeByPath("/psychology")]
[#assign rootMap = cmsfn.asContentMap(rootNode)]
[#macro listNodes node rootNode]
    [#if cmsfn.parent(node) == rootNode]
        [#if node.title?has_content]
            <h2>${node.title}</h2>
        [/#if]
    [/#if]
    [#if node.title?has_content && node != rootNode]
    <li><a href="${cmsfn.link(node)}">${node.title}</li></a>
    [/#if]

    [#if cmsfn.children(node, "mgnl:page")?size > 0]
        <ul>
        [#list cmsfn.children(node, "mgnl:page") as childNode ]
            [@listNodes childNode rootNode/]
        [/#list]
        </ul>
    [/#if]
[/#macro]

<div class="sitemap">
    <ul class="topLevel">
        [@listNodes rootMap rootMap][/@listNodes]
    </ul>
</div>
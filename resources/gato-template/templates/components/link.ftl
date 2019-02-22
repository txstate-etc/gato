[#if content.link?has_content]
    <a href="${gf.filterUrl(content.link)}">${gf.filterLinkTitle(content.text, content.link)}</a>
[/#if]
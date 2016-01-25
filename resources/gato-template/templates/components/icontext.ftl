[#assign iconColor = content.color!"color1"]
[#assign float = content.align!"center"]

[#macro buildIconText]
    <p class="icontext-icon ${iconColor}">
        <i class="fa ${content.icon!fa-cog}"></i>
    </p>
    [#if content.title?has_content]
        <h3 class="icontext-title">${content.title}</h3>
    [/#if]
    [#if content.text?has_content]
        <p class="icontext-text">
            ${content.text}
        </p>
    [/#if]
[/#macro]

[#if content.link?has_content]
    <a href="${gf.filterUrl(content.link)}" class="icontext ${float}">
        [@buildIconText/]
    </a>
[#else]
    <div class="icontext">
        [@buildIconText/]
    </div>
[/#if]

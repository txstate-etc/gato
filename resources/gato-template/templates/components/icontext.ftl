[#assign decodedContent = cmsfn.decode(content)]
[#assign iconColor = content.color!"color1"]
<div class="icontext">
    <div class="icontext-icon ${iconColor}">
        <i class="fa ${content.icon!fa-cog}"></i>
    </div>
    [#if decodedContent.text?has_content]
        <div class="icontext-text">
            ${gf.processRichText(decodedContent.text)}
        </div>
    [/#if]
</div>
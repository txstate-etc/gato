[#assign buttonType = content.buttonType!"gradient"]
[#assign buttonColor = content.color!"color1"]
[#assign buttonSize = content.size!]
[#assign buttonText = content.text!]
[#assign buttonLink = content.url!"#"]
[#if buttonType == "rollover" && content.image?has_content]
    [#assign buttonBG = "style=\"background-image: url('" + gf.getImgDefault(content.image) + "'); \"" ]
[/#if]
<div class="button-wrapper">
    <a href="${gf.filterUrl(buttonLink)}" class="button ${buttonType} ${buttonColor} ${buttonSize}" ${buttonBG!}>
        <span>${buttonText}</span>
    </a>
</div>


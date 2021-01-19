[#assign buttonType = content.buttonType!"gradient"]
[#assign buttonColor = content.color!"color1"]
[#assign buttonSize = content.size!]
[#assign buttonText = content.text!]
[#assign buttonLink = content.url!"#"]
[#assign buttonCenter = ((content.centered!false) && (buttonSize != 'block'))?string('center-button', '')]
[#if buttonType == "rollover" && content.image?has_content]
    [#assign buttonBG = "style=\"background-image: url('" + gf.getImgDefault(content.image) + "'); \"" ]
[/#if]
<div class="button-wrapper classic ${buttonCenter}">
    <a href="${gf.filterUrl(buttonLink)}" class="button ${buttonType} ${buttonColor} ${buttonSize} ${buttonCenter}" ${buttonBG!}>
        <span>${buttonText}</span>
    </a>
</div>


[#assign buttonType = content.buttonType!"gradient"]
[#assign buttonColor = content.color!]
[#assign buttonSize = content.size!]
[#assign buttonText = content.text!]
[#assign buttonLink = content.url!"#"]
[#if buttonType == "rollover" && content.image?has_content]
    [#assign buttonBG = "style=\"background: url('" + gf.getImgDefault(content.image) + "') no-repeat; \"" ]
[/#if]
<div class="button-wrapper">
    <a href="${buttonLink}" class="button ${buttonType} ${buttonColor} ${buttonSize}" ${buttonBG!}>
        <span>${buttonText}</span>
    </a>
</div>


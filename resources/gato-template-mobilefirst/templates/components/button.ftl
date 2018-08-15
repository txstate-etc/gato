[#assign center = (content.centered!false)?then('center', '')]
[#if content.buttonType == "rollover" && content.image?has_content]
    [#assign buttonBG = "style=\"background-image: url('" + gf.getImgDefault(content.image) + "'); \"" ]
[/#if]
<div class="mf-button-container ${center}">
  <a href="${gf.filterUrl(content.url)}" class="button ${content.buttonType!"solid"} ${content.color!"color1"} ${center}" ${buttonBG!}>
      <span>${content.text!}</span>
  </a>
</div>

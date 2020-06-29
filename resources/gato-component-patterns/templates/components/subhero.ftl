[#if content.mobileImage?has_content]
  [#assign mobileImage = content.mobileImage]
[#else]
  [#assign mobileImage = content.image]
[/#if]

[#macro subheroContent]
    <div data-opacity="${content.opacity!100}" class="color-overlay ${content.color!"color1"}">
      <div class="subhero-container ${content.alignment!"center"}">
        <div class="content-block" style="max-width: ${content.overlayWidth!}">
          <h2 class="title">${content.title!}</h2>
          <h3 class="subtitle">${content.subtitle!}</h3>
          <div class="text">
            ${gf.processRichTextLevel(cmsfn.decode(content).text, 3)}
          </div>
          [#if content.buttons?has_content]
            <div class="buttons">
              <ul>
              [#list cmsfn.children(content.buttons) as lnk]
                <li>
                  <a class="button" href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
                </li>
              [/#list]
              </ul>
            </div>
          [/#if]
        </div>
      </div>
    </div>
[/#macro]

[#if cmsfn.isEditMode()]
  <div cms:edit="bar"></div>
[/#if]
<div class="mobilefirst-pattern subhero" >
  <div class="subhero-content pattern-content" style='background-image: url("${gf.getImgDefault(content.image)}")'>
    [@subheroContent/]
  </div>
  <div class="subhero-content pattern-content mobile" style='background-image: url("${gf.getImgDefault(mobileImage)}")'>
    [@subheroContent/]
  </div>
</div>

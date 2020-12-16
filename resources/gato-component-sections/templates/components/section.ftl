<div id="${gf.htmlId(content)}" class="gato-msection ${ctx.hasBackground!''} ${(ctx.hideSidebar!false)?then('full-width', '')}">
  <div class="gato-section-full msection ${(ctx.hideSidebar!false)?then('full-width', '')}">
    <div class="gato-section-centered">
      <div class="gato-section eq-parent">
        [#if cmsfn.isEditMode() && ctx.hasBackground != ""]
          <div class="txst-khan-notice background-color-warning">
            Background color will not show up if this section is next to the sidebar.
          </div>
        [/#if]
        [#if cmsfn.isEditMode()]
          <div class="megasection-bar" cms:edit="bar"></div>
        [/#if]
        [#if !gf.isEmptyString(content.title)]
          <h2 class="msection-title ${content.titleAlign!'center'}">${content.title!}</h2>
        [/#if]
        [#if !gf.isEmptyString(content.anchor)]
          <div id=${content.anchor}></div>
        [/#if]
        [#if content.text?has_content]
          <div class="msection-text-container ${content.titleAlign!'center'}">
            <p class="msection-text">${content.text}</p>
          </div>
        [/#if]
      </div>
    </div>
  </div>
  [#assign headerlevel= gf.isEmptyString(content.title)?then(2,3)]
  [@cms.area name="layouts" contextAttributes={"headerlevel":headerlevel}/]
</div>
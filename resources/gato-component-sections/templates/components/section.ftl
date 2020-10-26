[#assign hasBackgroundClass = (content.showBackgroundColor!false)?string(' has-background','')]
[#assign cardLayoutClass = gf.isCardSection(content)?string(' card-layout', '')]
[#assign hideSidebar = ctx.getAttribute("hideSidebar")!false]
[#assign mainContentClass = hideSidebar?string(' full-width','')]
<div id="${gf.htmlId(content)}" class="gato-section-full ${mainContentClass} ${hasBackgroundClass}${cardLayoutClass}">
   [#if cmsfn.isEditMode() &&ctx.hasBackground!false]
    <div class="background-color-warning">
      <div class="txst-khan-notice">
        Background color will not show up if this section is next to the sidebar.
      </div>
    </div>
  [/#if]
  [#if cmsfn.isEditMode()]
    <div class="megasection-bar" cms:edit="bar"></div>
  [/#if]
  <div class="gato-section-centered">
    [#if !gf.isEmptyString(content.title)]
      <h2 class="msection-title ${content.titleAlign!'center'}">${content.title!}</h2>
    [/#if]
    [#if !gf.isEmptyString(content.anchor)]
      <div id=${content.anchor}></div>
    [/#if]
    [#assign headerlevel= gf.isEmptyString(content.title)?then(2,3)]
    [@cms.area name="layouts" contextAttributes={"headerlevel":headerlevel}/]
  </div>
</div>

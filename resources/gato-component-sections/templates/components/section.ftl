[#if cmsfn.isEditMode()]
<div class="megasection-bar" cms:edit="bar"></div>
[/#if]
<div class="megasection">
[#if !gf.isEmptyString(content.title)]
<h2 class="msection-title ${content.titleAlign!'center'}">${content.title!}</h2>
[/#if]
[#if !gf.isEmptyString(content.anchor)]
<div id=${content.anchor}></div>
[/#if]
[#assign headerlevel= gf.isEmptyString(content.title)?then(2,3)]
[@cms.area name="layouts" contextAttributes={"headerlevel":headerlevel}/]
</div>

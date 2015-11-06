[#assign mypage = cmsfn.page(content)]
[#assign inheritancelist = [mypage]+cmsfn.ancestors(mypage)?reverse]
[#list inheritancelist as page]
  [#assign himg = gf.singleComponent(page, 'headerImage')!null]
  [#if himg?has_content && (himg.visible=='hidden' || (himg.visible=='shown' && himg.shown?has_content))]
    [#break]
  [/#if]
[/#list]

[#assign imgStyle = ""]
[#assign imgClass = "bg_image_none"]
[#if himg?has_content && himg.visible == 'shown' && himg.shown??]
	[#assign imgStyle = "style=\"background-image: url('${damfn.getAssetLink(himg.shown)!}');\""]
	[#if cmsfn.ancestors(mypage)?has_content ]
		[#-- secondary page with header image--]
		[#assign imgClass = "bg_image_secondary"]
	[#else]
		[#-- primary page with header image--]
		[#assign imgClass = "bg_image"]
	[/#if]
[/#if]

[#if cmsfn.isEditMode()]
  <div class="headerImage_admin" cms:add="box">
    [#if component?has_content]
      [@cms.component content=component /]
    [/#if]
  </div>
[/#if]
<div class="bg_container">
	<div class="${imgClass}" id="headerImage" ${imgStyle}></div>
	<div class="overlay"><div class="bg_overlay"></div></div>
</div>

[#assign mypage = cmsfn.page(content)]
[#assign inheritancelist = [mypage]+cmsfn.ancestors(mypage)?reverse]
[#list inheritancelist as page]
  [#assign himg = gf.singleComponent(page, 'headerImage')!]
  [#if himg?has_content && (himg.visible=='hidden' || (himg.visible=='shown' && himg.shown?has_content))]
    [#break]
  [/#if]
[/#list]

[#assign defaultSrc = gf.getImgDefault(himg.shown)]
[#assign imgClass = "bg_image_none"]
[#if himg?has_content && himg.visible == 'shown' && defaultSrc?has_content]
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
[#if defaultSrc?has_content]
  <div class="bg_container">
    <div class="${imgClass}" id="headerImage">
      <img src="${defaultSrc}" srcset="${gf.getSrcSet(himg.shown)}" sizes="(min-width: 80rem) 1200px, 100vw" alt="">
    </div>
  </div>
[/#if]

[#assign cacheEnvironment = (ctx.request.getHeader("via")!'')?contains("Proxy-HistoryCache")]
[#assign globaldata = cmsfn.contentByPath('/global-data')]
[#assign page = cmsfn.page(content)]
[#assign ancestorstopdown = cmsfn.ancestors(page)]
[#assign ancestorsbottomup = cmsfn.ancestors(page)?reverse]
[#assign isHomePage = !ancestorstopdown?has_content]
[#assign homepage = page]
[#if !isHomePage][#assign homepage = ancestorstopdown?first][/#if]
[#assign thisPagePath = cmsfn.asJCRNode(page).path]
[#global showBannerArea = false]
[#macro bannerSettings content areaname]
  [#assign showBannerVal='inherit']
  [#assign gbsettings=gf.singleComponent(cmsfn.page(content), areaname)!]
  [#assign showBannerVal=gbsettings.visible!'inherit']

  [#list ancestorsbottomup as ancestor]
    [#assign agbsettings=gf.singleComponent(ancestor, areaname)!]
    [#if agbsettings?has_content && showBannerVal=='inherit']
      [#assign showBannerVal=agbsettings.visible!'inherit']
    [/#if]
  [/#list]
  [#global showBannerArea=(showBannerVal=='shown')]
[/#macro]
[#macro navloop items]
	[#list items as item]
		[#if !(item.hideInNav!false)]
			[#nested item]
		[/#if]
	[/#list]
[/#macro]

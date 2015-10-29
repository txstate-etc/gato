<!-- let's see if we should be displaying a banner -->
[#assign showBannerVal='inherit']
[#assign gbsettings=gf.singleComponent(content, 'gato-banners')!]
[#assign showBannerVal=gbsettings.visible!'inherit']

[#list ancestorstopdown as ancestor]
  [#if ancestor['banners']?has_content]
    [#assign agbsettings=gf.singleComponent(ancestor, 'gato-banners')!]
    [#if showBannerVal=='inherit']
      [#assign showBannerVal=agbsettings.visible!'inherit']
    [/#if]
	[/#if]
[/#list]

[#assign showBannerArea=(showBannerVal=='shown')]

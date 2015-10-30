<!-- let's see if we should be displaying a banner -->
[#assign showBannerVal='inherit']
[#assign gbsettings=gf.singleComponent(content, 'gato-banners')!]
[#assign showBannerVal=gbsettings.visible!'inherit']

[#list ancestorstopdown as ancestor]
  [#assign agbsettings=gf.singleComponent(ancestor, 'gato-banners')!]
  [#if agbsettings?? && showBannerVal=='inherit']
    [#assign showBannerVal=agbsettings.visible!'inherit']
  [/#if]
[/#list]
[#assign showBannerArea=(showBannerVal=='shown')]

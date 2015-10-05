<!-- let's see if we should be displaying a banner -->
[#assign gbsettings=content['gato-banner-settings']]
[#assign showBannerVal=(gbsettings.visible)!'inherit']
[#assign animateBanner=(gbsettings.animate)!'inherit']
[#assign animateBannerInterval=(gbsettings.interval)!0]

[#list ancestorstopdown as ancestor]
  [#assign agbsettings=ancestor['gato-banner-settings']]
	[#if showBannerVal=='inherit']
		[#assign showBannerVal=agbsettings.visible!'inherit']
	[/#if]
	[#if animateBanner=='inherit']
		[#assign animateBanner=agbsettings.animate!'inherit']
		[#assign animateBannerInterval=agbsettings.interval!0]
	[/#if]
[/#list]

[#assign showBannerArea=(showBannerVal=='shown')]
[#assign animateBanner=(animateBanner=='inherit')?string('static',animateBanner)]

<div class="gato-banner-settings">
	[@cms.area name="gato-banner-settings" /]
</div>

[#include "/gato-template/templates/includes/component.ftl"]
[#assign hasImage = component?has_content && component.image?has_content /]

<div class="banner-section ${hasImage?then('', 'noimage')}">
  <div class="banner">
    [#if component??]
        [@cms.component content=component /]
    [#else]
    <div class="banner-image wide">
      <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/default_banner.jpg" alt="Texas State University Campus"  width="1600" height="595">
    </div>
    [/#if]
    [#if cmsfn.isEditMode()]
    <div class="addBannerImage">
      <div cms:add="box"></div>
    </div>
    [/#if]
  </div>
  <div class="page-title">
    <a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a>
  </div>
</div>

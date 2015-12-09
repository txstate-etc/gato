[#import "/gato-template-txstate2015/templates/includes/headerImageLogic.ftl" as headerLogic]

[#if cmsfn.isEditMode()]
  <div class="headerImage_admin" cms:add="box">
    [#if component?has_content]
      [@cms.component content=component /]
    [/#if]
  </div>
[/#if]
[#if headerLogic.defaultSrc?has_content]
  <div class="bg_container">
    <div class="${headerLogic.imgClass}" id="headerImage">
      <img src="${headerLogic.defaultSrc}" srcset="${gf.getSrcSet(headerLogic.himg.shown)}" sizes="(min-width: 80rem) 1200px, 100vw" alt="">
    </div>
  </div>
[/#if]

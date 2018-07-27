[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-mobilefirst/js/standard.cjs']/]
    [@templatehead/]
    [@cms.area name="templatecss"/]
  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    <div class="page-container">
      [@skipnav/]
      <div class="page">
        [#include "includes/menu.ftl"]
        [#include "includes/header.ftl"]
        [#if def.parameters.isHomeTemplate!false]
          [@cms.area name="home-banner" content=gf.getOrCreateArea(homepage, 'home-banner')/]
        [#else]
          [@cms.area name="subpage-banner" content=gf.getOrCreateArea(page, 'subpage-banner')/]
        [/#if]
        [#import "/gato-template-mobilefirst/templates/includes/headerImageLogic.ftl" as headerLogic]
        [@cms.area name="organization-info" content=gf.getOrCreateArea(homepage, 'organization-info') editable=isHomePage contextAttributes={"isHome":def.parameters.isHomeTemplate!false, "hasImage":headerLogic.hasImage}/]
        <div class="page_content">
          <main class="contentcolumn">
            <div class="gato-section-full">
              <div class="gato-section-centered">
                <div class="gato-section">
                  [@breadcrumbs/]
                </div>
              </div>
            </div>
            [#assign hideSidebar = true /]
            [@headline hideSidebar /]
            [#if def.parameters.isHomeTemplate!false]
              [@cms.area name="mobileFirstContent"/]
            [#else]
              <div class="gato-section-full">
                <div class="gato-section-centered">
                  <div class="line-under-breadcrumbs"></div>
                </div>
              </div>
              [#if def.parameters.isMailTemplate!false]
                [@cms.area name="mail"/]
              [#else]
                [@cms.area name="contentParagraph"/]
              [/#if]
            [/#if]
          </main>
        </div>
        [#include "includes/footer.ftl"]
      </div>
      [@cssjsmodals /]
      [#include "/gato-template/templates/includes/video-modal.ftl"]
    </div>
  </body>
</html>

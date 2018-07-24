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
        [#if isHomePage]
          [@cms.area name="home-banner" content=gf.getOrCreateArea(homepage, 'home-banner')/]
        [#else]
          [@cms.area name="subpage-banner" content=gf.getOrCreateArea(page, 'subpage-banner')/]
        [/#if]
        <div class="page_content">
          <main class="contentcolumn">
            [#assign hideSidebar = true /]
            [@headline hideSidebar /]
            [@cms.area name="mobileFirstContent"/]
          </main>
        </div>
        [#include "includes/footer.ftl"]
      </div>
      [@cssjsmodals /]
      [#include "/gato-template/templates/includes/video-modal.ftl"]
    </div>
  </body>
</html>

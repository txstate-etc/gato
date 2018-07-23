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
        [@cms.area name="top-banner" content=gf.getOrCreateArea(homepage, 'top-banner')/]
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

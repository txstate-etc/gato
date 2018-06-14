[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-mobilefirst/js/standard.cjs']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-mobilefirst/css/standard.scss"/>
    <link href="https://fonts.googleapis.com/css?family=Adamina|Muli:300,300i,400,400i,600,600i,700,700i,800,800i" rel="stylesheet">
    [@templatehead/]
  </head>
  <body>
    [@skipnav/]
    [#include "includes/header.ftl"]
    [@cms.area name="top-banner" content=gf.getOrCreateArea(homepage, 'top-banner')/]
    <div class="page_content">
      <main class="contentcolumn">
        [#-- Right now, we don't even know if the standard mobile first template has a sidebar. --]
        [#assign hideSidebar = true /]
        [@headline hideSidebar /]
        [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
        [@cms.area name="fullWidthTest"/]
      </main>
    </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
  </body>
</html>

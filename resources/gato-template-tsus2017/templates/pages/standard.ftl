[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-tsus2017/js/standard.cjs', '/gato-template/js/sidebarwrap.js']/]
      <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-standard.scss"/>
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet"><!--font sheet from tsus demo-->
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet"><!--font sheet from tsus demo-->
    [@templatehead publisher="Texas State University System"/]
  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
    [#include "includes/header.ftl"]
        <div class="page_content">
          [#assign hideSidebar = content.hideSidebar!false]
          [#if !cmsfn.isEditMode() && !gf.areaHasChildrenIncludingInheritance(content.navBlocks)]
            [#assign hideSidebar = true]
          [/#if]
          <main class="contentcolumn">
            [@headline hideSidebar /]
              [#include "/gato-template/templates/includes/sacscocWarning.ftl"]
              [#if def.parameters.isMailTemplate!false]
                  [@cms.area name="mail" contextAttributes={"hideSidebar":hideSidebar} /]
              [#else]
                  [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
              [/#if]
            </main>
            [#if hideSidebar==false]
              <aside class="sidebar-container">
                <div class="sidebar">
                    [@cms.area name="navBlocks" /]
                </div>
              </aside>
            [/#if]
        </div>
    [#include "includes/footer.ftl"]
    [@cssjsmodals /]
    [#if hideSidebar]
      [@sidebarmodal skipsocial=true /]
    [/#if]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
    [#include "/gato-template/templates/includes/search-modal.ftl"]
  </body>
</html>

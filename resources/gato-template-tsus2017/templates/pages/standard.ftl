[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-template-tsus2017/js/tsus.js',
                          'gato-template/js/sidebarwrap.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-standard.compiled.css"/>
    [@templatehead publisher="Texas State University System"/]
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet"><!--font sheet from tsus demo-->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet"><!--font sheet from tsus demo-->
  </head>
  <body>
    [@skipnav/]
    [#include "includes/header.ftl"]
        <div class="page_content">
          [#assign hideSidebar = content.hideSidebar!false]
          [#if !cmsfn.isEditMode() && !gf.areaHasChildrenIncludingInheritance(content.navBlocks)]
            [#assign hideSidebar = true]
          [/#if]
          [@headline hideSidebar /]
          <main class="contentcolumn">
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
    <!-- if the sidebar is hidden, add a sidebar modal so they can edit it for child pages if necessary.
    See 2015 template and old TSUS template -->
    [@cssjsmodals /]
  </body>
</html>

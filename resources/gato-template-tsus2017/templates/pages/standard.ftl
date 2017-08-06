[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-lib/js/jquery-ui/jquery-ui.min.js',
                          'gato-lib/js/masonry.min.js',
                          'gato-template-tsus2017/js/tsus.js',
                          'gato-template/js/sidebarwrap.js',
                          'gato-template/js/dropdownsearch.js',
                          'gato-template/js/search-gsa.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-standard.compiled.css"/>
    [@templatehead publisher="Texas State University System"/]
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet"><!--font sheet from tsus demo-->
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet"><!--font sheet from tsus demo-->
  </head>
  <body>
    [#include "includes/header.ftl"]
        <div class="page_content">
          [#assign hideSidebar = content.hideSidebar!false]
          <main class="contentcolumn">
              [#if def.parameters.isMailTemplate!false]
                  [@cms.area name="mail" contextAttributes={"hideSidebar":hideSidebar} /]
              [#else]
                  [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
              [/#if]
            </main>
            [#if hideSidebar==false && (cmsfn.isEditMode() || gf.hasChildren(content.navBlocks))]
            [#assign showInEdit=cmsfn.editMode?string('show-inedit','')]
            <aside class="sidebar-container">
              <div class="sidebar ${showInEdit}">
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

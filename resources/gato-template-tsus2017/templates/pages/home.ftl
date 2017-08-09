[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE HTML>
<html lang="en">
    <head>
        [@templatejs scripts=['gato-template-tsus2017/js/tsus.js',
                              'gato-template/js/dropdownsearch.js',
                              'gato-template/js/search-gsa.js']/]
        <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-home.compiled.css"/>
        [@templatehead publisher="Texas State University System"/]
    </head>
    <body>

        [#include "includes/header.ftl"]
        <div class="contentcolumn">
          [#assign hideSidebar = true]
            <!-- slideshow -->
            <div class="tsus-slideshow eq-parent">
              [@cms.area name="tsus-slideshow" /]
            </div>

            [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]

            <div class="container">
                <!-- institution logos -->
                  <div class="tsus-institution-logos eq-parent">
                    [@cms.area name="tsuslogos" /]
                  </div>
            </div>
        </div>
        [#include "includes/footer.ftl"]
        [@cssjsmodals /]
        [@sidebarmodal skipsocial=true /]
    </body>
</html>

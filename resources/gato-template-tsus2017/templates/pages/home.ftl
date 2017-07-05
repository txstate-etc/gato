[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE HTML>
<html lang="en">
    <head>
        [@templatejs scripts=['gato-lib/js/jquery-ui/jquery-ui.min.js',
                              'gato-lib/js/masonry.min.js',
                              'gato-template-tsus2017/js/tsus.js',
                              'gato-template/js/dropdownsearch.js',
                              'gato-template/js/search-gsa.js']/]
        <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-home.compiled.css"/>
        [@templatehead publisher="Texas State University System"/]
    </head>
    <body>

        [#include "includes/header.ftl"]
        <div class="page_content">
            <!-- slideshow -->
            <div class="tsus-slideshow eq-parent">
              [@cms.area name="tsus-slideshow" /]
            </div>
            <!-- progress bars -->

            [@cms.area name="progress-section" /]
            <div class="container">

                <!-- news -->
                <div class="grid">
                      <div class="grid__sizer"></div>
                      [@cms.area name="news-section" /]
                </div>

                <!-- institution logos -->
                  <div class="tsus-institution-logos eq-parent">
                    [@cms.area name="tsuslogos" /]
                  </div>
            </div>
        </div>
        [#include "includes/footer.ftl"]
        [@cssjsmodals /]
    </body>
</html>

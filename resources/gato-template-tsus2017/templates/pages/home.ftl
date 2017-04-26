[#include "/gato-template/templates/includes/head.ftl"]
<!DOCTYPE HTML>
<html lang="en">
    <head>
        [@templatejs scripts=['gato-lib/js/jquery-ui/jquery-ui.min.js', 'gato-template-tsus2017/js/tsus.js']/]
        <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-home.compiled.css"/>
        [@templatehead publisher="Texas State University System"/]
    </head>
    <body>
        [#include "includes/header.ftl"]
        <!-- slideshow -->
        TSUS slideshow
        <!-- progress bars -->
        TSUS progress bars
        <!-- news -->
        News section
        <!-- institution logos -->
        Institution logos
        [#include "includes/footer.ftl"]
        [@cssjsmodals /]
    </body>
</html>
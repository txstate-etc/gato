[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@templatejs scripts=['gato-lib/js/jquery-ui/jquery-ui.min.js',
                          'gato-template-tsus2017/js/tsus.js',
                          'gato-template-txstate2015/js/sidebarwrap.js']/]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-tsus2017/css/tsus-standard.compiled.css"/>
    [@templatehead publisher="Texas State University System"/]
  </head>
  <body>
    [#include "includes/header.ftl"]
    <div class="container standard-container">
        <div class="page_content">
            [#assign hideSidebar = content.hideSidebar!false]
            [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
            [#if hideSidebar == false]
            <aside class="sidebar">
                <!-- search field should go here -->
                [@cms.area name="navBlocks" /]
                <!-- Need to add another content type for the TSUS sidebar.  The section labeled "Staff Directory"
                in the design can't be done with our current sidebar code.  The new component type should have a small
                image and some text to the right of it.  It does not change significantly on small screens.  Currently, 
                the only component type that can be added to each block is gato-template:components/link (see sidenav.yaml).  We need to be able to add the new component type to the sidebar as well, but probably only for TSUS. -->
                <!-- "Contact" block should go here -->
            </aside>
            [/#if]
        </div>
    </div>
    [#include "includes/footer.ftl"]
    <!-- if the sidebar is hidden, add a sidebar modal so they can edit it for child pages if necessary.  
    See 2015 template and old TSUS template -->
    [@cssjsmodals /]
  </body>
</html>

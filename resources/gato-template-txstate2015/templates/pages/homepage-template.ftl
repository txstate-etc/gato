[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    [#assign jsscripts = [
      'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
      'gato-template-txstate2015/js/respond.min.js',
      'gato-template-txstate2015/js/slideout.js',
      'gato-template-txstate2015/js/common.js'
    ]]
    [#if gf.isCacheEnvironment()]
      [#assign jsscripts = jsscripts + ['gato-template-txstate2015/js/fontsdotcom.js']]
    [/#if]
    [@templatejs scripts=jsscripts /]
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.2/fastclick.min.js"></script>

    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
    [@templatehead/]

  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    <nav id="menu" class="mobile_nav">
      [#import "includes/search.ftl" as search]
      [@search.searchBar true/]
      <div class="mobile_nav_container">
        <h3 class="contact_us mobile_dept"><a href="#nowhere">${gf.nodeTitle(content)}</a></h3>
        [#import "includes/mobile-menu.ftl" as menu]
        [@menu.menuBar isMobile=true/]
      </div>
      <!-- does social media need to go here -->
      <div class="mobile_super_container">
        [#include "includes/mobile-super-user.ftl"]
      </div>
    </nav>
    <div id="panel" class="container">
      <!--"super user" menu bar -->
      [#include "includes/super-user.ftl"]

      <!-- main menu -->
      <div class="top_nav">
        <!-- banner with logo and search bar -->
        [#include "includes/top-banner.ftl"]
      </div>
      
      <div class="main-content">
  
        [#include "includes/homepage/spotlight.ftl"]
        [#include "includes/homepage/social.ftl"]
        [#include "includes/homepage/president.ftl"]

      </div> <!-- end of page_content -->
      
      [#include "includes/footer.ftl"]
      [#include "includes/homepage/legal-footer.ftl"]

    </div> <!-- end of the container -->
    [@cssjsmodals /]
  </body>
</html>

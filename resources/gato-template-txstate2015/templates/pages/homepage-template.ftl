[#include "/gato-template/templates/includes/head.ftl"]
[#import "/gato-template/templates/includes/search-modal.ftl" as search]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
    [@templatejs scripts = [
      'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
      'gato-template-txstate2015/js/respond.min.js',
      'gato-template-txstate2015/js/slideout.js',
      'gato-lib/js/object-fit-images.min.js',
      'gato-template-txstate2015/js/homepage.js',
      'gato-template-txstate2015/js/tabs.js',
      'gato-lib/js/fastclick.js',
      'gato-template-txstate2015/js/common.js',
      'gato-template-txstate2015/js/fontsdotcom.js'
    ]]
    [@templatehead publisher='Texas State' /]

    <link rel="alternate" type="application/rss+xml"
        title="Texas State University News"
        href="http://feeds.feedburner.com/TexasStateNews" />

  </head>
  <body class="homepage ${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
    <nav id="menu" class="mobile_nav">
      <div class="mobile_nav_container">
        <h3 class="mobile-page-title"><a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a></h3>
        [#import "includes/homepage/mobile-menu.ftl" as menu]
        [@menu.menuBar isMobile=true/]
      </div>
      <!-- does social media need to go here -->
      <div class="mobile_super_container">
        [#include "includes/mobile-super-user.ftl"]
      </div>
    </nav>
    <div id="panel" class="container">
      [#include "includes/homepage/emergency.ftl"]
      <!--"super user" menu bar -->
      [#include "includes/super-user.ftl"]

      <!-- main menu -->
      <div class="homepage-top-nav">
        <!-- banner with logo and search bar -->
        [#include "includes/homepage/top-banner.ftl"]
      </div>

      <div class="main-content">
        <h2 id="maincontent" class="visuallyhidden">Main Content</h2>
        [#include "includes/homepage/top-feature.ftl"]
        [#include "includes/homepage/top-links.ftl"]
        [#include "includes/homepage/news.ftl"]
        [#include "includes/homepage/spotlight.ftl"]
        [#include "includes/homepage/social.ftl"]
        [#include "includes/homepage/president.ftl"]

      </div> <!-- end of page_content -->

      [#include "includes/footer.ftl"]
      [#include "includes/homepage/legal-footer.ftl"]

    </div> <!-- end of the container -->
    [@cssjsmodals /]
    [@sidebarmodal /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
    <!--  GENERATED-CONTENT-ENDS-DHTN23TN423HT4D -->
  </body>
</html>

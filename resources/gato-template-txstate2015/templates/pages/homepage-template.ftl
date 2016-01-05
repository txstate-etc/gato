[#include "/gato-template/templates/includes/head.ftl"]
[#import "includes/search.ftl" as search]

<!DOCTYPE HTML>
<html>
  <head>
    [#assign jsscripts = [
      'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
      'gato-template-txstate2015/js/respond.min.js',
      'gato-template-txstate2015/js/slideout.js',
      'gato-template-txstate2015/js/homepage.js',
      'gato-template-txstate2015/js/tabs.js',
      'gato-lib/js/fastclick.js',
      'gato-template-txstate2015/js/common.js'
    ]]
    [#if gf.isCacheEnvironment()]
      [#assign jsscripts = jsscripts + ['gato-template-txstate2015/js/fontsdotcom.js']]
    [/#if]
    [@templatejs scripts=jsscripts /]

    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
    [@templatehead publisher='Texas State' /]

    <link rel="alternate" type="application/rss+xml"
        title="Texas State University News"
        href="http://feeds.feedburner.com/TexasStateNews" />

  </head>
  <body class="homepage ${cmsfn.isEditMode()?string('admin','')}">
    <nav id="menu" class="mobile_nav">
      [@search.searchBar true false/]
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
    [#include "includes/homepage/video-modal.ftl"]
    <!--  GENERATED-CONTENT-ENDS-DHTN23TN423HT4D -->
  </body>
</html>

[#include "/gato-template/templates/includes/head.ftl"]
[#import "/gato-template/templates/includes/search-modal.ftl" as search]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    [@googletagmanager /]
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/homepage2015.scss"/>
    [@templatejs scripts = [
      'gato-template-txstate2015/js/includes.cjs',
      'gato-template-txstate2015/js/home.cjs',
      'gato-template-txstate2015/js/fontsdotcom.js'
    ]/]
    [@templatehead publisher='Texas State' /]

    <link rel="alternate" type="application/rss+xml"
        title="Texas State University News"
        href="http://feeds.feedburner.com/TexasStateNews" />

  </head>
  <body class="homepage ${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
    [@googletagmanagerbody /]
    <nav id="menu" class="mobile_nav" role="dialog">
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
        <h1 id="maincontent" class="visuallyhidden">Main Content</h1>
        [#include "includes/homepage/top-feature.ftl"]
        [#include "includes/homepage/top-links.ftl"]
        [#include "includes/homepage/news.ftl"]
        [@cms.area name="spotlight"/]
        [#include "includes/homepage/social.ftl"]
        [#include "includes/homepage/president.ftl"]

      </div> <!-- end of page_content -->

      [#include "includes/footer.ftl"]
      [#include "includes/homepage/legal-footer.ftl"]

    </div> <!-- end of the container -->
    [@cssjsmodals /]
    [@sidebarmodal /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
    [#assign useGlobalSearch = true]
    [#include "/gato-template/templates/includes/search-modal.ftl"]
    <!--  GENERATED-CONTENT-ENDS-DHTN23TN423HT4D -->
  </body>
</html>

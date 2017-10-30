[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.scss"/>
    [#assign jsscripts = [
      'gato-template-txstate2015/js/includes.cjs',
      'gato-template-txstate2015/js/globalsearch.js',
      'gato-template-txstate2015/js/fontsdotcom.js'
    ]/]
    [#if gf.isCacheEnvironment()]
      [#assign jsscripts = jsscripts + ['gato-template-txstate2015/js/fontsdotcom.js']]
    [/#if]
    [@templatejs scripts=jsscripts /]
    [@templatehead/]
  </head>
  <body class="${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
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
      <!--"super user" menu bar -->
      [#include "includes/super-user.ftl"]

      <!-- banner with logo and search bar -->
      [#include "includes/top-banner.ftl"]
      <!--header image, parent organization, department name -->
      [#include "includes/header.ftl"]

      <div class="search-container global web" id="search-results">
				<form class="search-form">
					<input type="text" class="search" name="q" value=""></input>
					<button class="icon magnify"><i class="fa fa-search" aria-label="Start Search"></i></button>
					<button class="icon reset"><i class="fa fa-times" aria-label="Reset Search"></i></button>
				</form>
        <div class="search-column-main eq-parent">
          <ul class="search-tabs" role="tablist">
            <li id="search-tab-web" class="search-tab-web" role="tab" tabindex="0">Web</li>
            <li id="search-tab-people" class="search-tab-people" role="tab" tabindex="0">People</li>
          </ul>
          <div class="search-web results-list" role="tabpanel" aria-labeledby="search-tab-web"></div>
          <div class="search-people results-list" role="tabpanel" aria-labeledby="search-tab-people"></div>
        </div>
        <div class="search-column-side">
          <div class="search-side-box search-side-people">
            <h4>People</h4>
            <div class="search-side-results"></div>
          </div>
        </div>
      </div>

      [#include "includes/footer.ftl"]
    </div> <!-- end of the container -->
    [@cssjsmodals /]
  </body>
</html>

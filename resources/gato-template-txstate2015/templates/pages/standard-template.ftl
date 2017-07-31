[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
	<head>
		<link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
    [#assign jsscripts = [
      'gato-template/js/search-gsa.js',
      'gato-template/js/video-slide.js',
      'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
      'gato-lib/js/jquery-ui/jquery-ui.min.js',
      'gato-template-txstate2015/js/respond.min.js',
      'gato-template-txstate2015/js/slideout.js',
      'gato-template-txstate2015/js/sidebarwrap.js',
      'gato-lib/js/fastclick.js',
      'gato-template-txstate2015/js/common.js',
      'gato-template/js/dropdownsearch.js'
    ]/]
    [#if gf.isCacheEnvironment()]
      [#assign jsscripts = jsscripts + ['gato-template-txstate2015/js/fontsdotcom.js']]
    [/#if]
    [@templatejs scripts=jsscripts /]
		[@templatehead/]
	</head>
	<body class="${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
		<nav id="menu" class="mobile_nav">
			<div class="mobile_nav_container">
				<div class="mobile_trail">
					[@breadcrumbs/]
				</div>
				<h3 class="mobile-page-title"><a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a></h3>
				[#import "includes/mobile-menu.ftl" as menu]
				[@menu.menuBar isMobile=true/]
			</div>
			<!-- social media in mobile menu -->
      [#include "/gato-template/templates/includes/socialsidenav.ftl"]
			[#include "includes/mobile-super-user.ftl"]
		</nav>
		<div id="panel" class="container">
			<!--"super user" menu bar -->
			[#include "includes/super-user.ftl"]

			<!-- banner with logo and search bar -->
			[#include "includes/top-banner.ftl"]
			<!--header image, parent organization, department name -->
			[#include "includes/header.ftl"]

			<!-- main menu -->
			<div class="top_nav">
				[@mainmenu textmenu=true /]
			</div>
			<div class="trail">
				[@breadcrumbs/]
			</div>
			<div class="page_content">
            <div class="content-alignment" data-sidebar-width-percentage="25"></div>
            [#assign hideSidebar = content.hideSidebar!false]
            [#if !isHomePage && !(content.hideTitle!false)]
                <div class="headline-parent">
                    <div class="headline">
                      <h1 id="maincontent">${gf.nodeTitle(content)}</h1>
                    </div>
                </div>
            [#else]
                <h1 id="maincontent" class="visuallyhidden">${gf.nodeTitle(content)}</h1>
            [/#if]
			[#if def.parameters.isMailTemplate!false]
				[@cms.area name="mail" contextAttributes={"hideSidebar":hideSidebar} /]
			[#else]
				[@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
			[/#if]
            [#if hideSidebar == false]
                <div class="sidebar">
                    [@cms.area name="navBlocks" /]
                    [#include "/gato-template/templates/includes/socialsidenav.ftl"]
                </div>
            [/#if]
			</div> <!-- end of page_content -->
			[#include "includes/footer.ftl"]
		</div> <!-- end of the container -->
		[@cssjsmodals /]
        [#if hideSidebar]
            [@sidebarmodal/]
        [/#if]
    [@cms.area name="gatoHours" content=gf.getOrCreateArea(homepage, 'gatoHours') /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
	</body>
</html>

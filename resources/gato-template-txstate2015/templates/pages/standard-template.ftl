[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en">
	<head>
		[@googletagmanager /]
		<link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.scss"/>
		[#assign scripts = [
      'gato-template-txstate2015/js/includes.cjs',
      'gato-template-txstate2015/js/standard.cjs',
      'gato-template-txstate2015/js/fontsdotcom.js'
    ]/]
		[#if def.parameters.isFilterableSearchTemplate!false]
      [#assign scripts = scripts + ['gato-area-filterable-search/js/filterablesearch.js','gato-template/js/backtotop.js']]
    [/#if]
    [@templatejs scripts /]
		[@templatehead/]
	</head>
	<body class="${cmsfn.isEditMode()?string('admin','')}">
    [@skipnav/]
		[@googletagmanagerbody /]
		<nav id="menu" class="mobile_nav" role="dialog">
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
        [#assign hideSidebar = content.hideSidebar!false]
        [#if !cmsfn.isEditMode() && !gf.areaHasChildrenIncludingInheritance(content.navBlocks) && !gf.hasChildren(homepage.socialmedia)]
           [#assign hideSidebar = true]
        [/#if]
				[#if def.parameters.isFilterableSearchTemplate!false || def.parameters.isPassthroughTemplate!false]
		      [#assign hideSidebar = true]
		    [/#if]
        <main class="contentcolumn">
					[#assign hideTitle = content.hideTitle!false]
					[@headline hideSidebar hideTitle/]
          [#include "/gato-template/templates/includes/sacscocWarning.ftl"]
          [#if def.parameters.isMailTemplate!false]
            [@cms.area name="mail" contextAttributes={"hideSidebar":hideSidebar} /]
          [#elseif def.parameters.isFilterableSearchTemplate!false]
	          [@cms.area name="filterable-search-intro"/]
	          [@cms.area name="filterable-search"/]
					[#elseif def.parameters.isSiteMapTemplate!false]
            [@cms.area name="siteMap" /]
					[#elseif def.parameters.isPassthroughTemplate!false]
						${gf.httpGetContentWithParameters(content.url)}
          [#else]
            [@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
          [/#if]
        </main>
        [#if hideSidebar == false]
        <aside class="sidebar-container">
            <div class="sidebar">
                [@cms.area name="navBlocks" /]
                [#include "/gato-template/templates/includes/socialsidenav.ftl"]
            </div>
        </aside>
        [/#if]
			</div> <!-- end of page_content -->
			[#include "includes/footer.ftl"]
		</div> <!-- end of the container -->
		[@cssjsmodals /]
		[#if def.parameters.isFilterableSearchTemplate!false && !cmsfn.isEditMode()]
				<button id="backtotop" aria-hidden="true" tabindex="-1">
				<i class="fa fa-angle-up" aria-hidden="true"></i>
				BACK TO TOP
			</button>
    [/#if]
        [#if hideSidebar]
            [@sidebarmodal/]
        [/#if]
    [@cms.area name="gatoHours" content=gf.getOrCreateArea(homepage, 'gatoHours') /]
    [#include "/gato-template/templates/includes/video-modal.ftl"]
		[#assign showSearchScope = true]
		[#include "/gato-template/templates/includes/search-modal.ftl"]
	</body>
</html>

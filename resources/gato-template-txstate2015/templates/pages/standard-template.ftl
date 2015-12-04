[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html>
	<head>
		[#assign jsscripts = [
			'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
			'gato-template-txstate2015/js/respond.min.js',
			'gato-template-txstate2015/js/slideout.js',
			'gato-template-txstate2015/js/sidebarwrap.js',
			'gato-template-txstate2015/js/common.js'
		]]
		[#if gf.isCacheEnvironment()]
			[#assign jsscripts = jsscripts + ['gato-template-txstate2015/js/fontsdotcom.js']]
		[/#if]
		[@templatejs scripts=jsscripts /]
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.2/fastclick.min.js"></script>

		<link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
		[@templatehead/]
    <link rel="apple-touch-icon" href="${gf.resourcePath()}/gato-template-txstate2015/images/txst_iphone_icon.png" />
	</head>
	<body class="${cmsfn.isEditMode()?string('admin','')}">
		<nav id="menu" class="mobile_nav">
			[#import "includes/search.ftl" as search]
			[@search.searchBar true/]
			<div class="mobile_nav_container">
				<div class="mobile_trail">
					[@breadcrumbs/]
				</div>
				<h3 class="mobile-page-title"><a href="${cmsfn.link(homepage)}">${gf.nodeTitle(homepage)}</a></h3>
				[#import "includes/mobile-menu.ftl" as menu]
				[@menu.menuBar isMobile=true/]
			</div>
			<!-- does social media need to go here -->
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
			<div class="trail eq-parent">
				<div class="eq-mn-off-1-3">
					[@breadcrumbs/]
				</div>
			</div>
			<div class="page_content eq-parent">
        [#if !isHomePage]
          [#include "includes/headline.ftl"]
        [/#if]
				[#assign hideSidebar = content.hideSidebar!false]
				[#if def.parameters.isMailTemplate!false]
					[@cms.area name="mail" /]
				[#else]
					[@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
				[/#if]

				[#if hideSidebar == false]
				<div class="eq-lg-1-4 sidebar">
					[@cms.area name="navBlocks" /]
					[#include "/gato-template/templates/includes/socialsidenav.ftl"]
				</div>
				[/#if]
			</div> <!-- end of page_content -->
			[#include "includes/footer.ftl"]
		</div> <!-- end of the container -->
		[@cssjsmodals /]
	</body>
</html>

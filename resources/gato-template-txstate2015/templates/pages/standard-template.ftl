[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		
		[@templatejs scripts=[
			'gato-template-txstate2015/js/jquery-scrolltofixed-min.js',
			'gato-template-txstate2015/js/respond.min.js',
			'gato-template-txstate2015/js/slideout.js',
			'gato-template-txstate2015/js/common.js'
		]/]
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.2/fastclick.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="${gf.resourcePath()}/gato-template-txstate2015/css/txstate2015.compiled.css"/>
		[@templatehead/]
		
	</head>
	<body>
		<nav id="menu" class="mobile_nav">
			[#import "includes/search.ftl" as search]
			[@search.searchBar true/]
			<div class="mobile_nav_container">
				<div class="mobile_trail">
					[@breadcrumbs/]
				</div>
				<h3 class="contact_us mobile_dept"><a href="#nowhere">${gf.nodeTitle(content)}</a></h3>
				[#import "includes/mobile-menu.ftl" as menu]
				[@menu.menuBar isMobile=true/]
			</div>
			<!-- does social media need to go here -->
			<div class="mobile_super_container">
				[#assign globalData = cmsfn.asContentMap(cmsfn.nodeByPath('/global-data', 'website'))]
				[@cms.area name="superUser" content=globalData.webTools editable=false contextAttributes={"isMobile":true}/]		
			</div>
		</nav>
		[#if cmsfn.isEditMode()]
			<div id="gato-customjs-modal" class="gato-customjs-column">		
				[@cms.area name="customjs" /]
			</div>
			<div id="gato-customcss-modal" class="gato-customjs-column">
				[@cms.area name="customcss" /]
			</div>
		[/#if]
		<div id="panel" class="container">
			<!--"super user" menu bar -->
			[@cms.area name="superUser" content=globalData.webTools contextAttributes={"isMobile":false}/]
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
			[#if !isHomePage]
				[#include "includes/headline.ftl"]
			[/#if]
			<div class="page_content eq-parent">
				[#assign hideSidebar = content.hideSidebar!false]
				[#if def.parameters.isMailTemplate!false]
					[@cms.area name="mail" /]
				[#else]
					[@cms.area name="contentParagraph" contextAttributes={"hideSidebar":hideSidebar} /]
				[/#if]

				[#if hideSidebar == false]
				<div class="eq-lg-1-4 sidebar">
					[@cms.area name="navBlocks" /]
				</div>
				[/#if]
			</div> <!-- end of page_content -->
			[#include "includes/footer.ftl"]
		</div> <!-- end of the container -->
	</body>
</html>

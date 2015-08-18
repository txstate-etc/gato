<!DOCTYPE HTML>
[#-- important variables set in here --]
[#include "includes/init.ftl"]
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		[#include "includes/head-common.ftl"]
		[@cms.page /]
	</head>
	<body>
		<nav id="menu" class="mobile_nav">
			[#import "includes/search.ftl" as search]
			[@search.searchBar true/]
			<div class="mobile_nav_container">
				<div class="mobile_trail">
					[#import "includes/breadcrumbs.ftl" as trail]
					[@trail.breadcrumbs hidetxstate=false isMobile=true/]
				</div>
				<h3 class="contact_us mobile_dept"><a href="#nowhere">${content.title}</a></h3>
				[#import "includes/main-menu.ftl" as menu]
				[@menu.menuBar isMobile=true/]
			</div>
			<!-- does social media need to go here -->
			<div class="mobile_super_container">
				[@cms.area name="superUser" contextAttributes={"isMobile":true}/]		
			</div>
		</nav>
		<div id="panel" class="container">
			<!--"super user" menu bar -->
			[@cms.area name="superUser" contextAttributes={"isMobile":false}/]
			<!-- banner with logo and search bar -->
			[#include "includes/top-banner.ftl"]
			<!--header image, parent organization, department name -->
			[#include "includes/header.ftl"]
		
			<!-- main menu -->
			<div class="top_nav">
    			<nav class="nav">
					[@menu.menuBar isMobile=false/]
				</nav>
			</div>
			<div class="page_content">
				<div class="row trail clearfix">
					<div class="column col-xs-2-3 flow-opposite">
						[@trail.breadcrumbs hidetxstate=false isMobile=false/]
					</div>
				</div> <!-- end breadcrumbs -->
				<div class="row clearfix">
					[#assign hideSidebar = content.hideSidebar!false]

					[#assign mainContentClass = hideSidebar?string('col-xs-1','col-xs-3-4')]
					<div class="column ${mainContentClass}">
						[#include "includes/headline.ftl"]
						[@cms.area name="contentParagraph" /]
					</div>
					[#if hideSidebar == false]
					<div class="column col-xs-1-4 sidebar">
						[@cms.area name="navBlocks" /]
					</div>
					[/#if]
				</div>
			</div> <!-- end of page_content -->
			[#include "includes/footer.ftl"]
		</div> <!-- end of the container -->
	</body>
</html>
[#include "/gato-lib/templates/includes/head.ftl"]

[#macro templatejs scripts]
	[@javascript scripts = [
		'gato-template/js/main-menus.js',
		'gato-template/js/post-load.js',
		'gato-faq-hierarchy/js/frontend.js',
		'gato-event-calendar/js/frontend.js'
	]+scripts /]
[/#macro]

[#macro templatecss files]
	[@css files = [
		'gato-template/css/yahoo-ui-reset.css',
		'gato-template/css/common.css',
		'gato-template/css/main-menus.css'
	]+files /]
[/#macro]

[#macro templatehead publisher="Texas State University"]
	[@meta publisher /]
	[@customCSS page ancestorstopdown /]
	[@customJS page ancestorstopdown /]
	[@title publisher /]
	[@cms.page /]
[/#macro]

[#macro title rootorg]
	<title>
		[@pagetitle page /]
		[#if !isHomePage]: ${ancestorstopdown?first.title}[/#if]
		[#if rootorg == "Texas State University"]: ${rootorg}[/#if]
	</title>
[/#macro]

[#macro meta publisher="Texas State University"]
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	[#if page.metaNoIndex?has_content]
		<meta name="ROBOTS" content="NOINDEX" />
	[/#if]
	[#if page.metaDescription?has_content]
		<meta name="description" content="${page.metaDescription}" />
		<meta name="DC.description" content="${page.metaDescription}" />
	[/#if]
	[#if page.metaKeywords?has_content]
		<meta name="keywords" content="${page.metaKeywords}" />
		<meta name="DC.subject" content="${page.metaKeywords}" />
	[/#if]
	<meta name="DC.publisher" content="${publisher}" />
	<meta name="DC.creator" content="${page}" />
	<meta name="DC.date" content="${cmsfn.metaData(page, 'mgnl:lastModified')}" />
	[#local lastmod = cmsfn.metaData(page, 'mgnl:lastModified')?datetime("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")]
	[#--TODO[#if contentIsStale]--]
		<meta name="contentIsStale" content="true" />
	[#--[/#if]--]
	[#--TODO <meta name="staleTimer" content="${inheritedcurrency}"/> --]
[/#macro]

[#macro sidebarmodal skipsocial=false]
[/#macro]

[#macro googleanalytics]
[/#macro]

[#macro navloop items]
	[#list items as item]
		[#if !(item.hideInNav!false)]
			[#nested item]
		[/#if]
	[/#list]
[/#macro]

[#macro pagetitle page][#compress]
	${page.title!page.@name?replace('\\W+',' ','r')?capitalize}
[/#compress][/#macro]

[#macro mainmenu textmenu=false]
	<nav class="ddmenu-bg">
		<div class="ddmenu-menubar">
			[@navloop cmsfn.children(homepage, 'mgnl:page') ; page]
				[#local haschildren = false]
				[@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
					[#local haschildren = true]
				[/@navloop]
				<div class="ddmenu-menubaritem ${haschildren?string('haschildren', '')}">
					<a href="${cmsfn.link(page)}" class="ddmenu-menubaritem">[@pagetitle page /]</a>
					[#if haschildren]
						<ul class="ddmenu-menu">
							[@navloop cmsfn.children(page, 'mgnl:page') ; subpage]
								<li><a href="${cmsfn.link(subpage)}">[@pagetitle page /]</a></li>
							[/@navloop]
						</ul>
					[/#if]
				</div>
			[/@navloop]
		</div>
	</nav>
[/#macro]

[#assign page = cmsfn.page(content)]
[#assign ancestorstopdown = cmsfn.ancestors(page)]
[#assign ancestorsbottomup = cmsfn.ancestors(page)?reverse]
[#assign isHomePage = !ancestorstopdown?has_content]
[#assign homepage = page]
[#if !isHomePage][#assign homepage = ancestorstopdown?first][/#if]

[#include "/gato-lib/templates/includes/head.ftl"]
[#include "/gato-component-cssjs/templates/includes/head.ftl"]
[#include "/gato-template/templates/includes/component.ftl"]
[#include "/gato-template/templates/includes/analytics.ftl"]

[#macro templatejs scripts]
	[@javascript scripts = [
		'gato-template/js/main-menus.js',
		'gato-template/js/outgoing-clicks.js',
		'gato-template/js/post-load.js',
		'gato-template/js/mailForm.js',
		'gato-template/js/easter-egg.js',
		'gato-template/js/webtools.js',
		'gato-lib/js/photoswipe/photoswipe.js',
		'gato-lib/js/photoswipe/photoswipe-ui-default.js',
		'gato-lib/js/photoswipe-util.js',
		'gato-component-gallery/js/gallery.js'
	]+scripts /]
[/#macro]

[#macro templatecss files]
	[@css files = [
		'gato-template/css/yahoo-ui-reset.css',
		'gato-template/css/common.css',
		'gato-template/css/main-menus.css',
		'gato-template/css/mailForm.css',
		'gato-component-cssjs/css/custom.css',
		'gato-component-sitemap/css/sitemap.css',
		'gato-component-faq/css/faqitem.css',
		'gato-lib/js/photoswipe/photoswipe.css',
		'gato-lib/js/photoswipe/default-skin/default-skin.css',
		'gato-component-gallery/css/gallery.css'
	]+files /]
[/#macro]

[#macro templatehead publisher="Texas State University"]
	[@meta publisher /]
	[@customCSS page ancestorstopdown /]
	[@customJS page ancestorstopdown /]
	[@title publisher /]
	[@googleanalytics /]
	[@javascriptvariables /]
	[@cms.page /]
[/#macro]

[#macro title rootorg]
	<title>
		[@pagetitle page /]
		[#if !isHomePage]: [@pagetitle homepage /][/#if]
		[#if rootorg == "Texas State University"]: ${rootorg}[/#if]
	</title>
[/#macro]

[#macro javascriptvariables]
	<script type="text/javascript">
		var serverDateTime = new Date(${.now?long});
		var magnolia_assets_url = "${gf.resourcePath()}";
	</script>
[/#macro]

[#macro meta publisher="Texas State University"]
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
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
	[#if cmsfn.isEditMode()]

	[/#if]
[/#macro]

[#macro navloop items]
	[#list items as item]
		[#if !(item.hideInNav!false)]
			[#nested item]
		[/#if]
	[/#list]
[/#macro]

[#macro pagetitle page]${gf.nodeTitle(page)}[/#macro]

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
								<li><a href="${cmsfn.link(subpage)}">[@pagetitle subpage /]</a></li>
							[/@navloop]
						</ul>
					[/#if]
				</div>
			[/@navloop]
		</div>
	</nav>
[/#macro]

[#macro breadcrumbs hidetxstate=false]
	<div id="breadcrumbs">
		[#if !hidetxstate]
			<a href="http://www.txstate.edu">Texas State</a>
			<span class="separator">&gt;</span>
		[/#if]
		[#-- Put the parent organization in the breadcrumbs if there is one --]
		[#if (homepage.parentOrganization)?? && cmsfn.children(homepage.parentOrganization)?size gt 0 ]
			[#local parentOrg = cmsfn.children(homepage.parentOrganization)?first]
			[#if parentOrg.parent_name?? && parentOrg.parent_name?length gt 0]
				<a href="${parentOrg.url!cmsfn.link(page)}">${parentOrg.parent_name}</a>
				<span class="separator">&gt;</span>
			[/#if]
		[/#if]
		[#list ancestorstopdown as ancestor]
			<a href="${cmsfn.link(ancestor)}">${gf.nodeTitle(ancestor)}</a>
			<span class="separator">&gt;</span>
		[/#list]
		<a href="${cmsfn.link(page)}" class="active">${gf.nodeTitle(page)}</a>
	</div>
[/#macro]

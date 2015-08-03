[#macro javascript scripts]
	[#list ['gato-lib/js/jquery.js', 'gato-lib/js/gato-lib.js'] + scripts as script]
		<script type="text/javascript" src="${script}"></script>
	[/#list]
[/#macro]

[#macro templatejs scripts]
	[@javascript scripts = [
		'/gato-templates/js/main-menus.js',
		'/gato-templates/js/post-load.js',
		'/gato-faq-hierarchy/js/frontend.js',
		'/gato-event-calendar/js/frontend.js'
	]+scripts]
[/#macro]

[#macro title txstate=true]
	<title>
		${page.title}
		[#if !isHomePage]: ancestorstopdown?first.title[/#if]
		[#if txstate]: Texas State University[/#if]
	</title>
[/#macro]

[#macro meta publisher="Texas State University"]
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	[#if page.metaNoIndex]
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
	<meta name="DC.date" content="${pageModificationDate}" />
	[#if contentIsStale]
		<meta name="contentIsStale" content="true" />
	[/#if]
	<meta name="staleTimer" content="${inheritedcurrency}"/>
[/#macro]

[#assign page = cmsfn.page(content)]
[#assign ancestorstopdown = cmsfn.ancestors(page)]
[#assign ancestorsbottomup = cmsfn.ancestors(page)?reverse]
[#assign isHomePage = ancestorstopdown?first.path == page.path]

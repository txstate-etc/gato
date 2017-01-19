[#include "/gato-template/templates/includes/component.ftl"]
[#macro menuBar isMobile]
	[#assign mobileClass = isMobile?string('mobile_', '')]
	<ul class="${mobileClass}primary_nav">
		[#-- for each child page of the home page, build a primary menu item --]
    	[#list cmsfn.children(homepage, 'mgnl:page') as childPage]
    		[#assign hidePage = childPage.hideInNav!false]
    		[#if !hidePage]
    			[#-- does this child page have children? --]
    			[#assign hasChildren = false]
    			[#list cmsfn.children(childPage, 'mgnl:page') as subpage]
    				[#assign hideSubPage = subpage.hideInNav!false]
    				[#if !hideSubPage]
    					[#assign hasChildren = true]
    				[/#if]
    			[/#list]
                <li>
                    <a href="${cmsfn.link(childPage)}">${gf.nodeTitle(childPage)}</a>
                    [#-- if the child page has its own children, build secondary menu items for them --]
                    [#if hasChildren]
                        <ul class="${mobileClass}secondary_nav">
                            [#list cmsfn.children(childPage, 'mgnl:page') as subpage]
                                [#assign hideSubPage = subpage.hideInNav!false]
                                [#if !hideSubPage]
                                    <li><a href="${cmsfn.link(subpage)}">${gf.nodeTitle(subpage)}</a></li>
                                [/#if]
                            [/#list]
                        </ul>
                    [/#if]
                </li>
    		[/#if]
    	[/#list]
	</ul>
[/#macro]

[#--assign homePageContent = cmsfn.contentByPath(homePagePath)--]
<div class="top_nav">
    <nav class="nav">
    	<ul class="primary_nav">
    		[#-- for each child page of the home page, build a primary menu item --]
	    	[#list cmsfn.children(homePageContent, 'mgnl:page') as childPage]
	    		[#assign hidePage = childPage.hideInNav!false] [#-- These assignments are not necessary if there is a default value for hideInNav --]
	    		[#if !hidePage]
	    			[#-- does this child page have children? --]
	    			[#assign hasChildren = false]
	    			[#list cmsfn.children(childPage, 'mgnl:page') as subpage]
	    				[#assign hideSubPage = subpage.hideInNav!false]
	    				[#if !hideSubPage]
	    					[#assign hasChildren = true]
	    				[/#if]
	    			[/#list]
	    		[/#if]
	    		<li>
	    			<a href="${cmsfn.link(childPage)}">${childPage.title}</a>
	    			[#-- if the child page has its own children, build secondary menu items for them --]
	    			[#if hasChildren]
		    			<ul class="secondary_nav">
		    				[#list cmsfn.children(childPage, 'mgnl:page') as subpage]
		    					[#assign hideSubPage = subpage.hideInNav!false]
			    				[#if !hideSubPage]
			    					<li><a href="${cmsfn.link(subpage)}">${subpage.title}</a></li>
			    				[/#if]
		    				[/#list]
						</ul>
	    			[/#if]
	    		</li>
	    		
	    	[/#list]
    	</ul>
    </nav>
</div>
[#--

[#assign homeLink = cmsfn.link(ctx.getAttribute("homePageContent"))]
[#assign paramEditable = true]
[#if cmsfn.link(content) == homeLink ]
  [#assign paramEditable = true]
[#else]
  [#assign paramEditable = false]
[/#if]
 --]

<div class="footer row">
	<div class="footer_content">
		<div class="footer_btt row">
			<a href="#nowhere" class="btt"><i class="fa fa-chevron-up"></i><br>Top</a>
		</div>
		<div class="column col-xs-1-3 footer_column footer_column_1">
			[@cms.area name="siteinfo" content=gf.getOrCreateArea(homepage, 'siteinfo') editable=isHomePage/]
		</div>
		<div class="column col-xs-1-3 footer_column footer_column_2" >
			<div class="txst_logo">
				<a class="image_link" href="#nowhere"><img alt="Texas State University - The Rising Star of Texas" src="${ctx.contextPath}/.resources/gato-template-txstate2015/resources/images/txst_logo.svg"></a>
			</div>
		</div>
		<div class="column col-xs-1-3 footer_column footer_column_3">
			[#assign globalData = cmsfn.asContentMap(cmsfn.nodeByPath('/global-data', 'website'))]
			[@cms.area name="footerLinks" content=globalData.footerLinks/]
			<a class="apply_now" href="https://www.applytexas.org">Apply Now</a>
		</div>
	</div> <!-- footer_content -->	
</div> <!-- footer -->

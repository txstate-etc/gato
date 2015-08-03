[#assign homeLink = cmsfn.link(ctx.getAttribute("homePageContent"))]
[#assign paramEditable = true]
[#if cmsfn.link(content) == homeLink ]
  [#assign paramEditable = true]
[#else]
  [#assign paramEditable = false]
[/#if]
<div class="footer row">
	<div class="footer_content">
		<div class="footer_btt row">
			<a href="#nowhere" class="btt"><i class="fa fa-chevron-up"></i><br>Top</a>
		</div>
		<div class="column third footer_column footer_column_1">
			[@cms.area name="contactInformation" editable=paramEditable/]
		</div>
		<div class="column third footer_column footer_column_2" >
			[#assign footerLogo = damfn.getAsset("jcr", "txst_logo.svg")!]
			[#if footerLogo??]
				<div class="txst_logo">
					<a class="image_link" href="#nowhere"><img alt="Texas State University - The Rising Star of Texas" src="${footerLogo.getLink()}"></a>
				</div>
			[/#if]
		</div>
		<div class="column third footer_column footer_column_3">
			[@cms.area name="footerLinks" editable=paramEditable/]
			<a class="apply_now" href="https://www.applytexas.org">Apply Now</a>
		</div>
	</div> <!-- footer_content -->	
</div> <!-- footer -->
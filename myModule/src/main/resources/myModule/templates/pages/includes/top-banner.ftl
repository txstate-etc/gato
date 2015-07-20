<div class="banner">
	<div class="banner_content">
		[#assign myAsset = damfn.getAsset("jcr", "txst-secondary.png")!]
		<div class="banner_logo">
			[#if myAsset??]
			    <a href="http://www.txstate.edu"><img src="${myAsset.getLink()}"/></a>
			[/#if]
		</div>
		<div class="hamburger">
			<a class="toggle-button" href="#nowhere"><i class="fa fa-bars fa-lg"></i></a>
		</div>
		<div class="txst_search">
			<div class="search_bar">
				<input type="search" class="search" placeholder="Search this site" />
			 <button class="icon"><i class="fa fa-search"></i></button>
			</div>
		</div>
	</div>
</div>
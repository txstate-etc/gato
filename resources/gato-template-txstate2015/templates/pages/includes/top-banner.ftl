<div class="banner">
	<div class="banner_content">
		<div class="banner_logo">
			    <a href="http://www.txstate.edu">
			    	<img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png"/>
			    </a>
		</div>
		<div class="hamburger">
			<a class="toggle-button" href="#">Menu</a>
		</div>
		[#import "search.ftl" as search]
		[@search.searchBar false/]
		<!--
		<div class="txst_search">
			<div class="search_bar">
				<input type="search" class="search" placeholder="Search this site" />
			 <button class="icon"><i class="fa fa-search"></i></button>
			</div>
		</div>
		-->
	</div>
</div>
<div class="banner">
	<div class="banner_content">
		<div class="banner_logo">
			    <a href="http://www.txstate.edu">
			    	<img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png" alt="Texas State University Logo"/>
			    </a>
		</div>
		<div class="hamburger standard-hamburger">
			<a class="search-link search-link-mobile" href="#" aria-label="Start search"><i class="fa fa-search"></i></a>
			<a class="search-link search-link-mobile toggle-button" href="#" aria-label="Menu - toggle site navigation"><i class="fa fa-bars"></i></a>
		</div>
		<div class="gato-search txst_search standard-search" role="search">
			<div class="search_bar">
				<a href="#" class="search-link">
					<span>Search</span>
					<i class="icon fa fa-search" aria-label="Start Search"></i>
				</a>
			</div>
		</div>
		<div class="search-wrapper">
		[#import "search-modal.ftl" as search]
        [@search.searchBar false true false/]
        </div>
	</div>
</div>

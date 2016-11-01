<div class="banner">
	<div class="banner_content">
		<div class="banner_logo">
			    <a href="http://www.txstate.edu">
			    	<img src="${ctx.contextPath}/.resources/gato-template-txstate2015/images/txst-secondary.png" alt="Texas State University Logo"/>
			    </a>
		</div>
		<div class="hamburger standard-hamburger">
			<button class="search-link search-link-mobile search-button" href="#" aria-label="Start search"><i class="fa fa-search"></i></button>
			<button class="search-link search-link-mobile toggle-button" href="#" aria-label="Menu - toggle site navigation"><i class="fa fa-bars"></i></button>
		</div>
		<div class="gato-search txst_search standard-search" role="search">
			<div class="search_bar">
				<button class="search-link search-button">
					<span>Search</span>
					<i class="icon fa fa-search" aria-label="Start Search"></i>
				</button>
			</div>
		</div>
		<div class="search-wrapper">
		[#import "search-modal.ftl" as search]
        [@search.searchBar false true false/]
        </div>
	</div>
</div>

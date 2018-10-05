<div class="banner">
	<div class="banner_content">
		<div class="banner_logo">
			    <a href="https://www.txstate.edu">
			    	<img src="${gf.resourcePath()}/gato-template-txstate2015/images/txst-secondary.png" alt="Texas State University Logo"/>
			    </a>
		</div>
		<div class="hamburger standard-hamburger">
			[#if !def.parameters.isSearchTemplate!false]
			<button class="search-link search-link-mobile search-button" aria-label="Start search"><i class="fa fa-search"></i></button>
			[/#if]
			<button class="search-link search-link-mobile toggle-button" aria-label="Menu - toggle site navigation"><i class="fa fa-bars"></i></button>
		</div>
		[#if !def.parameters.isSearchTemplate!false]
			<div class="gato-search txst_search standard-search" role="search">
				<div class="search_bar">
					<button class="search-link search-button">
						<span>Search</span>
						<i class="icon fa fa-search" aria-label="Start Search - hit enter to open dialog"></i>
					</button>
				</div>
			</div>
		[/#if]
		<div class="search-wrapper">
		[#import "/gato-template/templates/includes/search-modal.ftl" as search]
        [@search.searchBar false true false/]
        </div>
	</div>
</div>

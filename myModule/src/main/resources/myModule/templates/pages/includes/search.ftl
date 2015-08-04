[#macro searchBar isMobile]
	[#assign searchClass = isMobile?string('txst_mobile_search', 'txst_search')]
	[#assign mobileSearchBar = isMobile?string('mobile_search_bar', '')]
	[#assign mobileSearch = isMobile?string('mobile_search', '')]
	[#assign mobileIcon = isMobile?string('mobile_icon', '')]
	<div class="${searchClass}">
		<div class="search_bar ${mobileSearchBar}">
			<input type="search" class="search ${mobileSearch}" placeholder="Search this site" />
			<button class="icon ${mobileIcon}"><i class="fa fa-search"></i></button>
		</div>
	</div>
[/#macro]
[#-- loop through navblock components --]
[#-- need to handle inherited components and top/bottom sorting--]

[#list components as navBlock]
	<li>[@cms.component content=navBlock/]</li>
[/#list]
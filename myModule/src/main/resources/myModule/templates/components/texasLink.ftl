[#-- In the old version, the links are filtered with gatoutils: filterLinkTitle and filterUrl.  Also check for broken links --]

[#assign target = '_self']
[#if content.newWindow?? && content.newWindow]
	[#assign target = '_blank']
[/#if]

<a href="${content.link}" target="${target}">${content.text}</a>
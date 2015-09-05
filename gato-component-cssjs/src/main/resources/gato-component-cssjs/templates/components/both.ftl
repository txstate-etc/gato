[#macro display content codeproperty]
	[#if content.description?has_content]
		${content.description}
	[#else]
		<pre>${content[codeproperty]}</pre>
	[/#if]
[/#macro]
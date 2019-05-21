
[#-- if there is a title, put it here --]
[#if !gf.isEmptyString(content.title)]
	<h2>
		${content.title}
	</h2>
[/#if]

<div class="content">
	${gf.processRichText(cmsfn.decode(content).text)}
</div>

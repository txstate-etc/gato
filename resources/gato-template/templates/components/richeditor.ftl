[#assign setFirstHeader = true]
<div class="gato-rich-editor">
${gf.processRichTextLevel(cmsfn.decode(content).content, (ctx.headerlevel!2 + 1), setFirstHeader)}
</div>

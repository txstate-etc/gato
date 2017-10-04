[#assign background = "style=\"background-image: url('" + gf.getImgDefault(content.image, ctx.sizes) + "'); \"" ]
[#assign seqTitle = content.title?split(" ")]
[#assign title = ""]
[#list seqTitle as word]
  [#if (word?has_next)]
    [#assign title = title + " " + word]
  [#else]
    [#assign title = title + " <span>" + word + "</span>"]
  [/#if]
[/#list]

<div class="call-to-action" ${background}>
  <div class="overlay">
    <div class="title" data-max-lines="1">
      ${title}
    </div>
    <div class="bottomspace">
      <div class="container">
        <a class="linkbutton" href="${gf.filterUrl(content.link)}">
          <span>${content.buttontext}</span><i class="fa fa-long-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</div>

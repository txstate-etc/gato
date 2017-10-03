[#assign background = "style=\"background-image: url('" + gf.getImgDefault(content.image) + "'); \"" ]
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
    <a class="button" href="${gf.filterUrl(content.link)}">
        <div class="action-text">${content.buttontext}</div><div class="arrow"><i class="fa fa-long-arrow-right"></i></div>
    </a>
  </div>
</div>

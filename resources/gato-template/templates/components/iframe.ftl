<div class="txst-iframe-container" style="height: ${content.height!800}px">

  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]

  <iframe class="txst-iframe"
    frameborder="0"
    src="${gf.filterUrl(content.url)}"
    scrolling="no"
    title="${content.title!("Iframe embed of " + content.url)}">
    <a href="${gf.filterUrl(content.url)}">${content.title!content.url}</a>
  </iframe>

</div>

<div class="txst-iframe-container">

  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]

  <iframe class="txst-iframe"
    frameborder="0"
    style="height: ${content.height!800}px"
    src="${gf.filterUrl(content.url)}"
    scrolling="auto"
    sandbox="allow-forms allow-pointer-lock allow-popups allow-scripts"
    title="${content.title!("Iframe embed of " + content.url)}">
    <a href="${gf.filterUrl(content.url)}">${content.title!content.url}</a>
  </iframe>

</div>

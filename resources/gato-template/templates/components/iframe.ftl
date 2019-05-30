[#include "/gato-template/templates/includes/commonmacros.ftl"]
<div class="txst-iframe-container">

  [#if !gf.isEmptyString(content.title)]
    [@h2]${content.title}[/@h2]
  [/#if]

  <iframe class="txst-iframe"
    frameborder="0"
    style="height: ${content.height!800}px"
    src="${gf.filterUrl(content.url)}"
    scrolling="auto"
    sandbox="allow-forms allow-pointer-lock allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
    title="${content.title!("Iframe embed of " + content.url)}">
    <a href="${gf.filterUrl(content.url)}">${content.title!content.url}</a>
  </iframe>

</div>

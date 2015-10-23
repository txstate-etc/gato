<div class="txst-textimage">

  [#if content.title?has_content]
    <h2>${content.title}</h2>
  [/#if]

  <iframe class="txst-iframe" 
    frameborder="0" 
    style="height: ${content.height!800}px" 
    src="${content.url}" 
    scrolling="auto">
  </iframe>
  
</div>

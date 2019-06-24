[#if !(ctx.barsonly!false)]
<div class="overlay-content">
  <h2 class="title">${content.title}</h2>
  <div class="text">
    ${content.caption!''}
  </div>
  [#if content.buttons?has_content]
  <div class="buttons">
    <ul>
    [#list cmsfn.children(content.buttons) as lnk]
      <li>
        <a class="button" href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
      </li>
    [/#list]
    </ul>
  </div>
  [/#if]
</div>
[#else]
  <div class="slider-edit-bar" data-title="-${content.title!'Slider Image'}" cms:edit></div>
[/#if]
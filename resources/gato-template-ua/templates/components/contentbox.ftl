<div class="ua-contentbox">
  [#if content.image?has_content]
    <div class="ua-contentbox-image">
      <img src="${gf.getImgDefault(content.image)}" srcset="${gf.getSrcSet(content.image)}" sizes="302px" alt="${content.imagealt!}">
    </div>
  [/#if]
  [#if content.title?has_content]
    <h3 class="ua-contentbox-title">${content.title}</h3>
  [/#if]
  [#if content.text?has_content]
    <div class="ua-contentbox-text">${gf.processRichText(cmsfn.decode(content).text)}</div>
  [/#if]
</div>

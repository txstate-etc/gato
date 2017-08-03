[#assign decodedContent = cmsfn.decode(content)]
[#assign width = gf.getImgWidth(content.image)?c+'px']
[#assign sizes = gf.lesserwidth('100vw', width)]
[#assign editorClass = def.parameters.cssClass!""]

<div class="gato-card eq-parent ${content.sizeSelect!} ${cmsfn.editMode?string(editorClass, '')}">
    [#if content.link?has_content]
      <a href="${gf.filterUrl(content.link!)}">
    [/#if]

    [#if content.sizeSelect?has_content]
          <figure class="img-box">
    [#else]
          <figure>
    [/#if]
        <img src="${gf.getImgDefault(content.image, sizes)}" sizes="${sizes}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
        <figcaption class="${content.color!'color1'}">
            <h3>${decodedContent.title}</h3>
            <p>${decodedContent.subtext}</p>
        </figcaption>
    </figure>
    [#if content.link?has_content]
      </a>
    [/#if]
</div>

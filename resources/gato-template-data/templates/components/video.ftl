<div class="gato-textimage">
  <h2 class="gato-textimage-title">
    ${content.thumbnailAlt!}
  </h2>
  <div>
      ${content.title}
  </div>
  <div>
    <img src="${damfn.getAssetLink(content.thumbnail)}" alt="${content.thumbnailAlt!}" />
  </div>
  <div>
    <a href="${gf.absoluteUrl(content.videoUrl)}">${gf.absoluteUrl(content.videoUrl)}</a>
  </div>
  <p>
    ${content.section}
  </p>
</div>
<br/><hr/><br/>

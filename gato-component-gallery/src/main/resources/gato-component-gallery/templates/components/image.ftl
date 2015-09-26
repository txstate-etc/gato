[#assign assetMap = damfn.getAssetMap(content.image)]
[#assign imageSize = "${assetMap.metadata.mgnl.width?c}x${assetMap.metadata.mgnl.height?c}"]

<a href="${gf.getImgDefault(content.image)}" title="${content.caption!''}" data-size="${imageSize}">
  <img src="${gf.getImgSquare(content.image)}" alt="${content.imageAlt}" />
</a>

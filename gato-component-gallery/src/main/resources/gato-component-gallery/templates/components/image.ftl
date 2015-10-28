[#assign assetMap = damfn.getAssetMap(content.image)]
[#assign imageSize = "${assetMap.metadata.mgnl.width?c}x${assetMap.metadata.mgnl.height?c}"]

[#assign thumb]
  ${gf.getImgSquare(
    content.image,
    (content.imagecropleft!0)?number,
    (content.imagecropright!0)?number!0,
    (content.imagecroptop!0)?number!0,
    (content.imagecropbottom!0)?number!0
    )
  }
[/#assign]

<a href="${gf.getImgDefault(content.image)}" title="${content.caption!''}" data-size="${imageSize}">
  <img src="${thumb}" alt="${content.imageAlt!''}" />
</a>

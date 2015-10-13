[#assign assetMap = damfn.getAssetMap(content.image)]
[#assign imageSize = "${assetMap.metadata.mgnl.width?c}x${assetMap.metadata.mgnl.height?c}"]

[#assign thumb]
  ${gf.getImgSquare(
    content.image, 
    content.imagecropleft?number, 
    content.imagecropright?number, 
    content.imagecroptop?number, 
    content.imagecropbottom?number
    )
  }
[/#assign] 

<a href="${gf.getImgDefault(content.image)}" title="${content.caption!''}" data-size="${imageSize}">
  <img src="${thumb}" alt="${content.imageAlt!''}" />
</a>

[#assign asset = damfn.getAsset(content.image)]
[#assign assetMap = damfn.getAssetMap(content.image)]

[#assign imagePath = asset.link]
[#assign imageThumb = imagePath]
[#assign imageLarge = imagePath]
[#assign imageSize = "${assetMap.metadata.mgnl.width?c}x${assetMap.metadata.mgnl.height?c}"]

<a href="${imageLarge}" title="${content.caption!''}" data-size="${imageSize}">
  <img src="${imageThumb}" 
       class="txst-multiresolution-image" 
       alt="${content.imageAlt}" 
       border="0" 
       style="width: 100px; height: 100px;"
  />
</a>

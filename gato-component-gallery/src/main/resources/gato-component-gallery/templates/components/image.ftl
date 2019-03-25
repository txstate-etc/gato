[#assign assetMap = damfn.getAssetMap(content.image)]
[#assign imageSize = "${assetMap.metadata.mgnl.width?c}x${assetMap.metadata.mgnl.height?c}"]

[#assign thumb =
  gf.getImgDefault(
    content.image,
    (content.imagecropleft!0)?number!0,
    (content.imagecropright!0)?number!0,
    (content.imagecroptop!0)?number!0,
    (content.imagecropbottom!0)?number!0,
    true
  )
]
[#assign thumbsrcset =
  gf.getSrcSet(
    content.image,
    (content.imagecropleft!0)?number!0,
    (content.imagecropright!0)?number!0,
    (content.imagecroptop!0)?number!0,
    (content.imagecropbottom!0)?number!0,
    true
  )
]

<!--Check for whitespace in alt text-->
[#if gf.isEmptyString(content.imageAlt)]
  [#assign altText = ""]
  [#else]
  [#assign altText = content.imageAlt]
[/#if]

<a href="${gf.getImgDefault(content.image)}" title="${content.caption!''}" data-size="${imageSize}" data-srcset="${gf.getSrcSet(content.image)}">
  <img src="${thumb}" srcset="${thumbsrcset}" sizes="225px" alt="${altText}" />
</a>

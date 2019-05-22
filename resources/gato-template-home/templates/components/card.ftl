[#assign assetMap = damfn.getAssetMap(content.image)]
[#assign imageSize = "${assetMap.metadata.mgnl.width?c}x${assetMap.metadata.mgnl.height?c}"]
[#switch content.orientation]
  [#case "normal"]
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
    [#break]
  [#case "horizontal"]
    [#assign thumb =
      gf.getImgDefault(
        content.image,
        (content.widecropleft!0)?number!0,
        (content.widecropright!0)?number!0,
        (content.widecroptop!0)?number!0,
        (content.widecropbottom!0)?number!0,
        true
      )
    ]    
    [#assign thumbsrcset =
      gf.getSrcSet(
        content.image,
        (content.widecropleft!0)?number!0,
        (content.widecropright!0)?number!0,
        (content.widecroptop!0)?number!0,
        (content.widecropbottom!0)?number!0,
        true
      )
    ]      
    [#break]
  [#case "vertical"]
    [#assign thumb =
      gf.getImgDefault(
        content.image,
        (content.tallcropleft!0)?number!0,
        (content.tallcropright!0)?number!0,
        (content.tallcroptop!0)?number!0,
        (content.tallcropbottom!0)?number!0,
        true
      )
    ]    
    [#assign thumbsrcset =
      gf.getSrcSet(
        content.image,
        (content.tallcropleft!0)?number!0,
        (content.tallcropright!0)?number!0,
        (content.tallcroptop!0)?number!0,
        (content.tallcropbottom!0)?number!0,
        true
      )
    ]      
    [#break]
  [#default]
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
  [/#switch]

<!--Check for whitespace in alt text-->
[#if gf.isEmptyString(content.imageAlt)]
  [#assign altText = ""]
  [#else]
  [#assign altText = content.imageAlt]
[/#if]

<a href="${gf.getImgDefault(content.image)}" title="${content.caption!''}" data-size="${imageSize}" data-srcset="${gf.getSrcSet(content.image)}">
  <img src="${thumb}" srcset="${thumbsrcset}" sizes="225px" alt="${altText}" />
</a>

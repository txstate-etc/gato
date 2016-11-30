${ctx.response.setContentType('application/json; charset=UTF-8')}
[#assign serverUrl = ctx.request.getHeader("host")]
[
[#list cmsfn.children(gf.singleComponent(content, 'contentParagraph').column1, 'mgnl:component') as section]
  {
    "section": "${ section.title! }",
    "images": [
      [#list cmsfn.children(section.images, 'mgnl:component') as photo]
        [#assign asset = damfn.getAsset(photo.image)]
        {
          "name": "${ asset.fileName }",
          "altText": "${ (cmsfn.decode(photo).imageAlt!'')?json_string }",
          "caption": "${ (cmsfn.decode(photo).caption!'')?json_string }",
          "modified": "${gf.getModificationDate(photo)?string("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z")}",
          [#-- "image": "${gf.absoluteUrl(damfn.getAssetLink(photo.image))}", --]
           "image": "${serverUrl}${damfn.getAssetLink(photo.image)?replace(ctx.contextPath, '')?replace('//', '/')}",
          "imagecroptop": "${ photo.imagecroptop }",
          "imagecropleft": "${ photo.imagecropleft }",
          "imagecropright": "${ photo.imagecropright }",
          "imagecropbottom": "${ photo.imagecropbottom }"
        }[#if photo_has_next],[/#if]
      [/#list]
    ]
  }[#if section_has_next],[/#if]
[/#list]
]

[
[#list cmsfn.children(gf.singleComponent(content, 'contentParagraph').column1, 'mgnl:component') as video]
  [#if video.videoUrl?has_content]
    {
      "videoUrl": "${gf.absoluteUrl(video.videoUrl)}",
      "thumbnailAlt": "${ (video.thumbnailAlt!'')?json_string }",
      "title": "${ (video.title!'')?json_string }",
      "modified": "${gf.getLastModified(video)?string("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z")}",
      [#if video.thumbnail?has_content]
        "thumbnail": {
          "path": "${gf.absoluteUrl(damfn.getAssetLink(video.thumbnail))}"
        }
      [/#if]
    }[#if video_has_next],[/#if]
  [/#if]
[/#list]
]

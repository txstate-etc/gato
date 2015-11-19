{
"categories": [
  {"key":"bobcattube", "title":"Bobcat Tube"}
],
"bobcattube": [
[#list cmsfn.children(gf.singleComponent(content, 'contentParagraph').column1, 'mgnl:component') as video]
  [#if video.videoUrl?has_content]
    {
      "videoUrl": "${gf.absoluteUrl(video.videoUrl)}",
      "thumbnailAlt": "${ (cmsfn.decode(video).thumbnailAlt!'')?json_string }",
      "title": "${ (cmsfn.decode(video).title!'')?json_string }",
      "modified": "${gf.getModificationDate(video)?string("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z")}",
      [#if video.thumbnail?has_content]
        "thumbnail": {
          [#-- Stupid mobile app assumes a relative path. "path": "${gf.absoluteUrl(damfn.getAssetLink(video.thumbnail))}" --]
          "path": "${damfn.getAssetLink(video.thumbnail)}"
        }
      [/#if]
    }[#if video_has_next],[/#if]
  [/#if]
[/#list]
]
}

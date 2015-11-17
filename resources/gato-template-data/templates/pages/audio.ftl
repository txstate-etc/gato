[
[#list cmsfn.children(gf.singleComponent(content, 'contentParagraph').column1, 'mgnl:component') as audio]
  {
    "title": "${ audio.title! }",
    "modified": "${gf.getLastModified(audio)?string("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z")}",
    "file": "${gf.absoluteUrl(damfn.getAssetLink(audio.file))}",
    "lyrics": "${cmsfn.decode(audio).lyrics?json_string}"
  }[#if audio_has_next],[/#if]
[/#list]
]

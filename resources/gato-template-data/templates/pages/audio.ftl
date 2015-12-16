[
[#list cmsfn.children(gf.singleComponent(content, 'contentParagraph').column1, 'mgnl:component') as audio]
  {
    "title": "${ audio.title! }",
    "modified": "${gf.getModificationDate(audio)?string("EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z")}",
    "file": "${gf.absoluteDamUrl(audio.file)}",
    "lyrics": "${cmsfn.decode(audio).lyrics?json_string}"
  }[#if audio_has_next],[/#if]
[/#list]
]

[#if content.link??]
  [#if content.link?contains("facebook")]
    [#assign iconclass="fa-facebook-square"]
    [#assign alttext="Facebook"]
  [#elseif content.link?contains("twitter")]
    [#assign iconclass="fa-twitter-square"]
    [#assign alttext="Twitter"]
  [#elseif content.link?matches(r"youtu\.?be")]
    [#assign iconclass="fa-youtube-square"]
    [#assign alttext="YouTube"]
  [#elseif content.link?contains("vimeo")]
    [#assign iconclass="fa-vimeo-square"]
    [#assign alttext="Vimeo"]
  [#elseif content.link?contains("pinterest")]
    [#assign iconclass="fa-pinterest-square"]
    [#assign alttext="Pinterest"]
  [#elseif content.link?contains("tumblr")]
    [#assign iconclass="fa-tumblr-square"]
    [#assign alttext="Tumblr"]
  [#elseif content.link?contains("instagram")]
    [#assign iconclass="fa-instagram"]
    [#assign alttext="Instagram"]
  [#elseif content.link?contains("spotify")]
    [#assign iconclass="fa-spotify"]
    [#assign alttext="Spotify"]
  [#elseif content.link?contains("linkedin")]
    [#assign iconclass="fa-linkedin-square"]
    [#assign alttext="LinkedIn"]
  [/#if]
  [#assign alttext = alttext!'Our Blog']
  [#assign title = alttext]
  [#if content.title?has_content]
    [#if content.icononly!false]
      [#assign title = content.title]
    [#elseif content.title?lower_case?contains(alttext?lower_case)]
      [#assign title = '']
    [/#if]
  [/#if]
  <a href="${content.link}" class="gato-sociallink ${(content.icononly!false)?string('icononly','')}">
    [#if content.icon?has_content]
      <img src="${damfn.getAssetLink(content.icon)}" alt="${alttext}" title="${title}"/>[#--
    --][#else][#--
      --]<i class="fa ${iconclass!'fa-rss-square'}" aria-label="${alttext}"></i>[#--
    --][/#if][#--
    --]${content.title!}[#--
    --][#if !(content.icononly!false)][#--
      --]${content.title!alttext}[#--
    --][/#if][#--
  --]</a>
[/#if]

[#if gf.hasChildren(content.socialmedia)]
  <ul class="social-media-icons">
    [#list cmsfn.children(content.socialmedia) as socialink]

        [#if socialink.link?has_content]
          [#if socialink.link?contains("facebook")]
              [#assign iconclass="fa-facebook-square"]
              [#assign alttext="Facebook"]
          [#elseif socialink.link?contains("flickr")]
              [#assign iconclass="fa-flickr"]
              [#assign alttext="Flickr"]
          [#elseif socialink.link?contains("github")]
              [#assign iconclass="fa-github"]
              [#assign alttext="Github"]
          [#elseif socialink.link?contains("instagram")]
              [#assign iconclass="fa-instagram"]
              [#assign alttext="Instagram"]
          [#elseif socialink.link?contains("linkedin")]
              [#assign iconclass="fa-linkedin-square"]
              [#assign alttext="LinkedIn"]
          [#elseif socialink.link?contains("pinterest")]
              [#assign iconclass="fa-pinterest-square"]
              [#assign alttext="Pinterest"]
          [#elseif socialink.link?contains("snapchat")]
              [#assign iconclass="fa-snapchat-square"]
              [#assign alttext="Snapchat"]
          [#elseif socialink.link?contains("spotify")]
              [#assign iconclass="fa-spotify"]
              [#assign alttext="Spotify"]
          [#elseif socialink.link?contains("tumblr")]
              [#assign iconclass="fa-tumblr-square"]
              [#assign alttext="Tumblr"]
          [#elseif socialink.link?contains("twitter")]
              [#assign iconclass="fa-twitter-square"]
              [#assign alttext="Twitter"]
          [#elseif socialink.link?contains("vimeo")]
              [#assign iconclass="fa-vimeo-square"]
              [#assign alttext="Vimeo"]
          [#elseif socialink.link?contains("wordpress")]
              [#assign iconclass="fa-rss-square"]
              [#assign alttext="Wordpress"]
          [#elseif socialink.link?contains("txstate.edu")]
              [#assign iconclass="fa-star"]
              [#assign alttext="Texas State"]
          [#elseif socialink.link?matches(r".*youtu\.?be.*")]
              [#assign iconclass="fa-youtube-square"]
              [#assign alttext="YouTube"]
          [/#if]

          [#if !alttext?has_content]
          [#-- unrecognized service, let's see if we can regex out the top two levels of their domain name --]
          [#assign alttext = socialink.link?replace('^.*//','','r')?replace('/.*', '', 'r')?replace('^[^\\.]*\\.([^\\.]*\\.[^\\.]*)$','$1','r')]
          [#if !alttext?has_content][#assign alttext = "Social Link"][/#if]
          [/#if]

          [#assign linktext = socialink.title!alttext]
          [#if ctx.icononly!false][#assign linktext = ''][/#if]

          [#assign title = alttext]
          [#if linktext?lower_case?contains(alttext?lower_case)]
          [#assign title = '']
          [/#if]

          <li>
                <a href="${socialink.link}" class="gato-sociallink ${(ctx.icononly!false)?string('icononly','')}">
                   [#if content.icon?has_content]
                     <img src="${damfn.getAssetLink(socialink.icon)!}" alt="${title}" [#if title?has_content]title="${title}"[/#if]/>[#--
                   --][#else][#--
                     --]<i class="fa ${iconclass!'fa-share-alt-square'}" [#if title?has_content]aria-label="${title}"[#else]aria-hidden="true"[/#if]></i>[#--
                   --][/#if][#--
                   --]${linktext}[#--
                 --]</a>
          </li>
        [/#if]

    [/#list]
    </ul>
[/#if]

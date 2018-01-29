[#assign service = restfn.getService("smcache", "edu.txstate.its.gato.rest.SmCacheService")]

[#macro timestamp val]
  [#if val?has_content]
    [#local d = gf.parseJsonDate(val)?datetime /]
    <span class="timestamp relative" data-timestamp="${val!}" title="Time posted: ${d?string.full}">
      ${d?string.short}
    </span>
  [/#if]
[/#macro]

[#attempt]
[#assign response = service.all() /]
[#if response?has_content]
<div id="social" class="content-row main three-col">
  <div class="content-row-content">

      <div class="solo-column">
        <div class="solo-title">
          <h2 class="column-title">Connect with Us</h2>
        </div>
      </div>

      <div class="content-row-column">
        <div class="instagram col-left eq-parent">
          [#assign post = response.path("instagram").path(0) /]
          [#if post?has_content]
            [#assign link = post.path('link').asText() /]
            [#assign image = post.path('image_proxy').asText() /]
            [#assign caption = post.path('caption').asText() /]
            [#assign time = post.path('posttime').asText() /]
            <div class="social-upper">
              <figure class="image">
                [#if post.get('slides')?has_content && post.get('slides').getElements()?has_content]
                  <div class="slides">
                    [#list post.get('slides').getElements() as att]
                      <div class="slide">
                        <a href="${link!}" class="linktosmsite">
                          <img src="${gf.getImg(att.get('url').asText(), 640, 640, true, false, 0, 0, 0, 0)}" alt="Instagram Post">
                        </a>
                        [#if att.get('video_url').asText()?has_content]
                          <a href="${att.get('video_url').asText()}" class="feature-play-button"
                          data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(att.get('video_url').asText()), 'html')?html}"><i class="fa fa-play" aria-hidden="true"></i><span class="visuallyhidden">Play Video</span></a>
                        [/#if]
                      </div>
                    [/#list]
                  </div>
                  <a href="#" class="arrow prev fa fa-angle-left" aria-hidden="true"></a>
                  <a href="#" class="arrow next fa fa-angle-right" aria-hidden="true"></a>
                [#else]
                  <a href="${link!}" class="linktosmsite">
                    <img src="${gf.getImg(image!, 640, 640, true, false, 0, 0, 0, 0)}" alt="Instagram Post">
                  </a>
                  [#if !post.get('video_url').isNull() && post.get('video_url').asText()?has_content]
                    <a href="${post.get('video_url').asText()}" class="feature-play-button"
                    data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(post.get('video_url').asText()), 'html')?html}"><i class="fa fa-play" aria-hidden="true"></i><span class="visuallyhidden">Play Video</span></a>
                  [/#if]
                [/#if]
                <figcaption class="caption">
                  <p>${gf.linkifyInstagram(caption)!}</p>
                  <p><span class="source-link">(<a href="${link!}">via Instagram</a>)</span></p>
                </figcaption>
              </figure>
            </div>
            <div class="social-lower">
              <p>
                [@timestamp time /]
                <span class="social-area-icon">
                  <a href="https://www.instagram.com/txst">
                    <i class="fa fa-instagram"></i>
                    <span class="visuallyhidden">Instagram</span>
                  </a>
                </span>
              </p>
            </div>
          [/#if]
        </div>
      </div>[#--

    --]<div class="content-row-column twitter-wrap">
        <div class="twitter col-middle">
          <div class="social-upper">
            <div class="slides">
              [#list response.path("twitter").getElements() as post]
                [#assign screen_name = post.path('screen_name').asText() /]
                [#assign display_name = post.path('display_name').asText() /]
                [#assign link = post.path('link').asText() /]
                [#assign caption = post.path('html').asText() /]
                [#assign time = post.path('tweettime').asText() /]
                <div class="slide" style="${(post_index == 0)?string('','display:none;')}">
                  <p class="twitter-handle">
                    <a href="https://twitter.com/${screen_name!}">@${screen_name!}</a>
                  </p>
                  <p class="twitter-name">${display_name!}</p>
                  <p class="tweet">${caption!}</p>
                  <p class="twitter-timestamp">[@timestamp time /]</p>
                </div>
              [/#list]
            </div>
          </div>

          <div class="social-lower">
            <p>
              <span class="twitter-timestamp">[@timestamp response.path("twitter").path(0).path('tweettime').asText() /]</span>
              <span class="social-area-icon">
                <a href="https://twitter.com/txst">
                  <i class="fa fa-twitter"></i>
                  <span class="visuallyhidden">Twitter</span>
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>[#--

    --]<div class="content-row-column">
        <div class="facebook col-right">
          [#assign post = response.path("facebook").path(0) /]
          [#if post?has_content]
            [#assign link = post.path('link').asText() /]
            [#assign image = post.path('image_proxy').asText() /]
            [#assign caption = post.path('caption').asText() /]
            [#assign time = post.path('posttime').asText() /]
            <div class="social-upper">
              <figure class="image">
                [#if post.get('slides')?has_content && post.get('slides').getElements()?has_content]
                  <div class="slides">
                    [#list post.get('slides').getElements() as att]
                      <div class="slide">
                        <a href="${link!}" class="linktosmsite">
                          <img src="${gf.getImg(att.get('url').asText(), 640, 640, true, false, 0, 0, 0, 0)}" alt="Facebook Post">
                        </a>
                      </div>
                    [/#list]
                  </div>
                  <a href="#" class="arrow prev fa fa-angle-left" aria-hidden="true"></a>
                  <a href="#" class="arrow next fa fa-angle-right" aria-hidden="true"></a>
                [#else]
                  <div class="noslides">
                    <a href="${link!}" class="linktosmsite noslides">
                      <img src="${gf.getImg(image!, 640, 640, true, false, 0, 0, 0, 0)}" alt="Facebook Post">
                    </a>
                    [#if !post.get('video_url').isNull() && post.get('video_url').asText()?has_content]
                      <a href="${post.get('video_url').asText()}" class="feature-play-button"
                      data-embed="${post.get('video_embed_html').asText()?html}"><i class="fa fa-play" aria-hidden="true"></i><span class="visuallyhidden">Play Video</span></a>
                    [/#if]
                  </div>
                [/#if]
                <figcaption class="fb-content">
                  <p class="desc">${gf.linkify(caption)!}</p>
                  <p><a class="source-link" href="${link!}">(via Facebook)</a></p>
                </figcaption>
              </figure>
            </div>

            <div class="social-lower">
              <p>
                [@timestamp time /]
                <span class="social-area-icon">
                  <a href="https://www.facebook.com/TXSTATEU">
                    <i class="fa fa-facebook-official"></i>
                    <span class="visuallyhidden">Facebook</span>
                  </a>
                </span>
              </p>
            </div>
          [/#if]
        </div>
      </div>[#--

    --]<div class="solo-column">
        <div class="solo-bailout">
          <p>
            <a href="http://www.txstate.edu/social" class="solo-bailout-button">
              Social Media Directory<i class="button-chevron fa fa-chevron-right"></i>
            </a>
          </p>
        </div>
      </div>

  </div>
</div>
[/#if]
[#recover]
  <!-- ERROR: Failed to get social media content! -->
[/#attempt]

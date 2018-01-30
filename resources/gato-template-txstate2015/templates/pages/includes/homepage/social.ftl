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
[#assign response = gf.restClientNodeToFreemarker(service.all()) /]
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
          [#assign post = response['instagram'][0] /]
          [#if post?has_content]
            <figure class="social-upper">
              <div class="figcontent">
                [#if post['slides']?has_content]
                  [#list post['slides'] as att]
                    <div class="slide">
                      <a href="${post['link']!}" class="linktosmsite">
                        <img src="${gf.getImg(att['url'], 640, 640, true, false, 0, 0, 0, 0)}" alt="Instagram Post">
                      </a>
                      [#if att['video_url']?has_content]
                        <a href="${att['video_url']}" class="feature-play-button"><i class="fa fa-play" aria-hidden="true"></i><span class="visuallyhidden">Play Video</span></a>
                      [/#if]
                    </div>
                  [/#list]
                  <a href="#" class="arrow prev fa fa-angle-left" aria-hidden="true"></a>
                  <a href="#" class="arrow next fa fa-angle-right" aria-hidden="true"></a>
                [#else]
                  <a href="${post['link']!}" class="linktosmsite">
                    <img src="${gf.getImg(post['image_url']!, 640, 640, true, false, 0, 0, 0, 0)}" alt="Instagram Post">
                  </a>
                  [#if post['video_url']?has_content]
                    <a href="${post['video_url']}" class="feature-play-button"><i class="fa fa-play" aria-hidden="true"></i><span class="visuallyhidden">Play Video</span></a>
                  [/#if]
                [/#if]
              </div>
              <figcaption>
                ${gf.linkifyInstagram(gf.textToHtmlWithMaxLines(post['caption'], 4, 45))}
                <div class="source-link"><a href="${post['link']!}">View post on Instagram</a></div>
              </figcaption>
            </figure>
            <div class="social-lower">
              [@timestamp post['posttime'] /]
              <a href="https://www.instagram.com/txst" class="social-area-icon">
                <i class="fa fa-instagram"></i>
                <span class="visuallyhidden">Instagram</span>
              </a>
            </div>
          [/#if]
        </div>
      </div>[#--

    --]<div class="content-row-column twitter-wrap">
        <div class="twitter col-middle">
          <div class="social-upper">
            <div class="slides">
              [#list response['twitter'] as post]
                <div class="slide" style="${(post_index == 0)?string('','display:none;')}">
                  <p class="twitter-handle">
                    <a href="https://twitter.com/${post['screen_name']!}">@${post['screen_name']!}</a>
                  </p>
                  <p class="twitter-name">${post['display_name']!}</p>
                  <p class="tweet">${post['html']!}</p>
                  <p class="twitter-timestamp">[@timestamp post['tweettime'] /]</p>
                </div>
              [/#list]
            </div>
          </div>

          <div class="social-lower">
            <span class="twitter-timestamp">[@timestamp response['twitter'][0]['tweettime'] /]</span>
            <a href="https://twitter.com/txst" class="social-area-icon">
              <i class="fa fa-twitter"></i>
              <span class="visuallyhidden">Twitter</span>
            </a>
          </div>
        </div>
      </div>[#--

    --]<div class="content-row-column">
        <div class="facebook col-right">
          [#assign post = response['facebook'][0] /]
          [#if post?has_content]
            <figure class="social-upper">
              <div class="figcontent">
                [#if post['slides']?has_content]
                  [#list post['slides'] as att]
                    <div class="slide">
                      <a href="${post['link']!}" class="linktosmsite">
                        <img src="${gf.getImg(att['url'], 640, 640, true, false, 0, 0, 0, 0)}" alt="Facebook Post">
                      </a>
                    </div>
                  [/#list]
                  <a href="#" class="arrow prev fa fa-angle-left" aria-hidden="true"></a>
                  <a href="#" class="arrow next fa fa-angle-right" aria-hidden="true"></a>
                [#else]
                  <a href="${post['link']!}" class="linktosmsite">
                    <img src="${gf.getImg(post['image_url']!, 640, 640, true, false, 0, 0, 0, 0)}" alt="Facebook Post">
                  </a>
                  [#if !post['video_url']?has_content]
                    <a href="${post['video_url']}" class="feature-play-button"
                    data-embed="${post['video_embed_html']?html}"><i class="fa fa-play" aria-hidden="true"></i><span class="visuallyhidden">Play Video</span></a>
                  [/#if]
                [/#if]
              </div>
              <figcaption>
                ${gf.textToHtmlWithMaxLines(post['caption'], 3, 45)}
                <div class="source-link"><a href="${link!}">View post on Facebook</a><div>
              </figcaption>
            </figure>

            <div class="social-lower">
              [@timestamp post['posttime'] /]
              <a href="https://www.facebook.com/TXSTATEU" class="social-area-icon">
                <i class="fa fa-facebook-official"></i>
                <span class="visuallyhidden">Facebook</span>
              </a>
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

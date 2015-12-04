[#assign service = restfn.getService("smcache", "edu.txstate.its.gato.SmCacheService")]
[#assign response = service.all() /]

[#macro timestamp val]
  [#if val?has_content]
    [#local d = gf.parseJsonDate(val)?datetime /]
    <span class="timestamp relative" data-timestamp="${val!}" title="Time posted: ${d?string.full}">
      ${d?string.short}
    </span>
  [/#if]
[/#macro]

<div id="social" class="content-row main three-col">
  <div class="content-row-content">

    <div class="eq-parent">

        <div class="eq-mn-1-1 eq-ml-1-1">
          <div class="solo-title">
            <h2>Connect with Us</h2>
          </div>
        </div>

        <div class="eq-mn-1-1 eq-ml-1-3">
          <div class="instagram col-left">
            [#assign post = response.path("instagram").path(0) /]
            [#if post?has_content]
              [#assign link = post.path('link').asText() /]
              [#assign image = post.path('image_proxy').asText() /]
              [#assign caption = post.path('caption').asText() /]
              [#assign time = post.path('posttime').asText() /]
              <div class="social-upper">
                <figure class="image">
                  <a href="${link!}">
                    <img src="${gf.getImg(image!, 640, 640, true, false, 0, 0, 0, 0)}">
                  </a>
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
                    </a>
                  </span>
                </p>
              </div>
            [/#if]
          </div>
        </div><!-- Instagram -->[#--
        
        --]<div class="eq-mn-1-1 eq-ml-1-3 twitter-wrap">
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
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>[#--
      
        --]<div class="eq-mn-1-1 eq-ml-1-3">        
          <div class="facebook col-right">
            [#assign post = response.path("facebook").path(0) /]
            [#if post?has_content]
              [#assign link = post.path('link').asText() /]
              [#assign image = post.path('image_proxy').asText() /]
              [#assign caption = post.path('caption').asText() /]
              [#assign time = post.path('posttime').asText() /]          
              <div class="social-upper">
                <figure class="image">
                  <a href="${link!}">
                    <img src="${gf.getImg(image!, 1080, 0, false, false, 0, 0, 0, 0)}">
                  </a>
                  <figcaption class="fb-content">
                    <p>${gf.linkify(caption)!}</p>
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
                    </a>
                  </span>
                </p>
              </div>
            [/#if]
          </div>
        </div>[#--
        
        --]<div class="eq-mn-1-1 eq-ml-1-1">
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
</div>

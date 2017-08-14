         <div class="gato-card gato-card-streaming">
          [#if content.videourl?has_content]
          <div class="gato-card-streaming-wrap slide">
            <p class="feature-play-button">
              <a href="${content.videourl}" class="${content.color!'color1'}"
              data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}">
                <i class="fa fa-play" aria-hidden="true"></i>
                <span class="visuallyhidden">Play Video</span>
              </a>
            </p>
            <figure class="img-box">
              <!--where the thumbnail image will go-->
                [#if content.thumbnail?has_content]
                  <img class='userThumbnail' src="${gf.getImgDefault(content.thumbnail)}"
                    alt="thumbnail for video" srcset="${gf.getSrcSet(content.thumbnail)}" />
                [/#if]

                  <figcaption class="${content.color!'color1'}">
                    [#if content.title?has_content]
                      <h3>${content.title}</h3>
                    [/#if]
                  </figcaption>
            </figure>
          </div>
          [/#if]
        </div>

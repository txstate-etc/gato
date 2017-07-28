[#if content.sizeSelect?has_content]
      <div class="gato-card gato-card-streaming eq-parent ${content.sizeSelect! }">
        [#if content.videourl?has_content]
        <div class="gato-card-streaming-wrap">
          <p class="feature-play-button">
            <a href="${content.videourl}"
            data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}">
              <i class="fa fa-youtube-play" aria-hidden="true"></i>
              <span class="visuallyhidden">Play Video</span>
            </a>
          </p>
          <figure class="img-box ${content.color!'color1'}">
            <!--where the thumbnail image will go-->
              [#if content.thumbnail?has_content]
                <img class='userThumbnail' src="${gf.getImgDefault(content.thumbnail, sizes)}" sizes="${sizes}"
                  alt="thumbnail for video" srcset="${gf.getSrcSet(content.thumbnail)}" />
              [/#if]

                <figcaption>
              [#if content.title?has_content]
                <h3>${content.title}</h3>
              [/#if]
                </figcaption>
          </figure>
        </div>
        [/#if]
        <div  id="video-modal"  class='masonry-video-modal' style="display: none;">
          <div class="video-modal-buttons">
            <a class="video-modal-close" href="#"><i class="fa fa-close"></i><span class="visuallyhidden">Close</span></a>
          </div>
          <div class="video-container"></div><!--where the video will go-->
        </div>
      </div>


[/#if]

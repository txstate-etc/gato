
[#if cmsfn.isEditMode()]
<div cms:edit="bar"></div>
[/#if]
<div class="textImagePatternWrapper ${(content.hasBackground!false)?then('background', '')}">
  <div class="mobilefirst-pattern textImageCTA ${content.imageAlignment!'image-right'}">
  [#if content.imageAlignment == 'image-left']
    <div class="pattern-image">
      <div class="video-wrapper">
        <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
        [#if content.videourl?has_content]
          <a href="${content.videourl}" class="feature-play-button video-left"
          data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}">
            <i class="fa fa-play" aria-hidden="true"></i>
            <span class="visuallyhidden">Play Video</span>
          </a>
        [/#if]
      </div>
    </div>
  [/#if]
  <div class="pattern-content title-type">
    [#if content.title?has_content]<div class="title">${content.title}</div>[/#if]
    [#if content.text?has_content]<div class="text">${gf.processRichText(cmsfn.decode(content).text)}</div>[/#if]
    [#if content.buttons?has_content]
    <div class="buttons">
      <ul>
      [#list cmsfn.children(content.buttons) as lnk]
        <li>
          <a class="button" href="${gf.filterUrl(lnk.link)}">${lnk.text!}</a>
        </li>
      [/#list]
      </ul>
    </div>
    [/#if]
    </div>
    [#if content.imageAlignment == 'image-right']
      <div class="pattern-image">
        <div class="video-wrapper">
          <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" />
          [#if content.videourl?has_content]
            <a href="${content.videourl}" class="feature-play-button video-right"
            data-embed="${gf.jsonGetString(gf.oEmbedAutodiscover(content.videourl), 'html')?html}">
              <i class="fa fa-play" aria-hidden="true"></i>
              <span class="visuallyhidden">Play Video</span>
            </a>
          [/#if]
        </div>
      </div>
    [/#if]
  </div>
</div>

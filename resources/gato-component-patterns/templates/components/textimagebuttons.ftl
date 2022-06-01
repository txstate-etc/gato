[#include "/gato-component-patterns/templates/includes/pattern.ftl"]
[#if !gf.isEmptyString(content.anchor)]
  <div id=${content.anchor}></div>
[/#if]
[@prebuiltsection]
  [#if cmsfn.isEditMode()]
  <div class="content-edit" cms:edit="bar"></div>
  [/#if]
  <div class="textImagePatternWrapper ${(content.hasBackground!false)?then('background', '')}">
    <div class="mobilefirst-pattern textImageCTA ${content.imageAlignment!'image-right'}">
    [#if content.imageAlignment == 'image-left']
      <div class="pattern-image">
        <div class="video-wrapper">
          <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" sizes="(max-width: 50em) 1000px, 50vw"/>
          [#if content.videourl?has_content]
            [#assign oembed = gf.oEmbedCached(content)!]
            <a href="${content.videourl}" class="feature-play-button video-left"
              data-embed="${gf.jsonGetString(oembed, 'html')?html}"
              data-embedwidth="${gf.jsonGetString(oembed, 'width')}"
              data-embedheight="${gf.jsonGetString(oembed, 'height')}"
            >
              <i class="fa fa-play" aria-hidden="true"></i>
              <span class="visuallyhidden">Play Video</span>
            </a>
          [/#if]
        </div>
      </div>
    [/#if]
    <div class="pattern-content title-type">
      [#assign headerLevel = 2]
      [#if !gf.isEmptyString(content.title)]
        <h2 class="title">${content.title}</h2>
        [#assign headerLevel = 3]
      [/#if]
      [#if content.text?has_content]<div class="text">${gf.processRichTextLevel(cmsfn.decode(content).text, headerLevel)}</div>[/#if]
      [#if content.buttons?has_content && gf.hasChildren(content.buttons)]
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
            <img src="${gf.getImgDefault(content.image)}" alt="${content.imageAlt!}" srcset="${gf.getSrcSet(content.image)}" sizes="(max-width: 50em) 1000px, 50vw"/>
            [#if content.videourl?has_content]
              [#assign oembed = gf.oEmbedCached(content)!]
              <a href="${content.videourl}" class="feature-play-button video-right"
                data-embed="${gf.jsonGetString(oembed, 'html')?html}"
                data-embedwidth="${gf.jsonGetString(oembed, 'width')}"
                data-embedheight="${gf.jsonGetString(oembed, 'height')}"
              >
                <i class="fa fa-play" aria-hidden="true"></i>
                <span class="visuallyhidden">Play Video</span>
              </a>
            [/#if]
          </div>
        </div>
      [/#if]
    </div>
  </div>
[/@prebuiltsection]

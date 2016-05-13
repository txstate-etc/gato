[#macro rssitem node moddate=.now body='' title='' link='' guid='' enclosure={}]
  <item>
    <pubDate>
      [#local moddate = gf.getModificationDate(node)]
      [#if !moddate?has_content]
        [#local moddate = .now]
      [/#if]
      ${moddate?string["EEE, dd MMM yyyy HH:mm:ss Z"]}
    </pubDate>

    [#if title?has_content]
      <title>${title}</title>
    [#elseif node.title?has_content]
      <title>${node.title}</title>
    [/#if]

    [#if link?has_content]
      <link>${link}</link>
    [#elseif node.link?has_content]
      <link>[#if gf.isCacheEnvironment()]${gf.filterUrl(node.link)}[#else]${ gf.absoluteUrl(node.link) }[/#if]</link>
    [#else]
      <link>[#if gf.isCacheEnvironment()]${cmsfn.link(cmsfn.page(node))}[#else]${gf.absoluteUrl(cmsfn.link(cmsfn.page(node)))}[/#if]#${node.@id?substring(0,8)}</link>
    [/#if]

    [#if !body?has_content]
      [#local body]
        [#nested]
      [/#local]
    [/#if]
    <description><![CDATA[${gf.convertLinksToAbsolute(body)}]]></description>

    [#if enclosure?has_content]
      [#if enclosure.mime?has_content]
        [#local mime = enclosure.mime]
      [#elseif enclosure.extension?has_content]
        [#local mime = gf.getMimeType(enclosure.extension)]
      [#else]
        [#local extension = enclosure.url?replace('[#\\?].*$','','r')?replace('.*\\.','','r')]
        [#if extension?has_content]
          [#local mime = gf.getMimeType(extension)]
        [/#if]
      [/#if]
      [#if !mime?has_content]
        [#local mime = 'application/octet-stream']
      [/#if]
      <enclosure url="${gf.absoluteUrl(enclosure.url)}" length="${enclosure.size!0}" type="${mime}" />
    [/#if]

    [#if !guid?has_content]
      [#local guid = node.@id]
    [/#if]
    <guid isPermaLink="false">${ guid }</guid>
  </item>
[/#macro]

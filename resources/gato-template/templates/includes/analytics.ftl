[#macro googleanalytics]
  [#if cacheEnvironment]
    [#local content = cmsfn.inherit(content)]

    [#if content.googleanalytics?has_content]
      <script async src="https://www.googletagmanager.com/gtag/js?id=${content.googleanalytics}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${content.googleanalytics}');
        gtag('event', 'page_view', { 'send_to': '${content.googleanalytics}' })
      </script>
    [/#if]

    [#if (globalData.analytics.global_account)?has_content && !(content.googleanalyticsSkipGlobal!false)]
      [#if isHomePage]
          [#local gapath = '${thisPagePath}/']
      [#else]
        [#local gapath = '${thisPagePath}.html']
      [/#if]
      <script async src="https://www.googletagmanager.com/gtag/js?id=${globalData.analytics.global_account}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${globalData.analytics.global_account}');
        gtag('event', 'page_view', { 'send_to': '${globalData.analytics.global_account}' })
      </script>
    [/#if]

  [/#if]
[/#macro]

[#macro googletagmanager]
  [#local account = homepage.tagmanagercontainerid!]
  [#if cacheEnvironment && account?has_content]
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${account}');</script>
<!-- End Google Tag Manager -->
  [/#if]
[/#macro]
[#macro googletagmanagerbody]
  [#local account = homepage.tagmanagercontainerid!]
  [#if cacheEnvironment && account?has_content]
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${account}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
  [/#if]
[/#macro]

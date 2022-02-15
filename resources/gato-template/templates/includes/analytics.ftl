[#macro googleanalytics]
  [#if cacheEnvironment]
    [#local globalAccounts = (globalData.analytics.global_account!"")?split(",")]
    [#local content = cmsfn.inherit(content)]
    [#local localAccounts = (content.googleanalytics!"")?split(",")]
    [#if globalAccounts[0]?has_content]
      [#local primaryAccount = globalAccounts[0]]
    [#elseif localAccounts[0]?has_content]
      [#local primaryAccount = localAccounts[0]]
    [/#if]
    [#if primaryAccount?has_content]
      <!-- Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${primaryAccount}"></script>
      <script>
        window.sendAnalyticsEvents = true;
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        [#if !(content.googleanalyticsSkipGlobal!false)]
          [#list globalAccounts as prop]
            [#if prop?has_content]gtag('config', '${prop}');[/#if]
          [/#list]
        [/#if]
        [#list localAccounts as prop]
          [#if prop?has_content]gtag('config', '${prop}');[/#if]
        [/#list]
      </script>
      <!-- End Google Analytics -->
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

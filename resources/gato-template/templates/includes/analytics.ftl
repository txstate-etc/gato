[#macro googleanalytics]
  [#if cacheEnvironment]
    [#local content = cmsfn.inherit(content)]

    <script type="text/javascript">

      // Load the universal analytics.js script.
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      [#if content.googleanalytics?has_content]

            var destroyerSitePageTracker = {
              trackingId: '${content.googleanalytics}',
              name: 'destroyerSitePageTracker'
            };
            ga('create', destroyerSitePageTracker);
            ga(destroyerSitePageTracker.name + '.require', 'displayfeatures');
            ga(destroyerSitePageTracker.name + '.send', 'pageview');

      [/#if]

      [#if (globalData.analytics.global_account)?has_content && !(content.googleanalyticsSkipGlobal!false)]

        [#if isHomePage]
          [#local gapath = '${thisPagePath}/']
        [#else]
          [#local gapath = '${thisPagePath}.html']
        [/#if]

        var destroyerGlobalPageTracker = {
          trackingId: '${globalData.analytics.global_account}',
          name: 'destroyerGlobalPageTracker',
          cookieDomain: 'auto'
        };
        ga('create', destroyerGlobalPageTracker);
        ga(destroyerGlobalPageTracker.name + '.require', 'displayfeatures');
        ga(destroyerGlobalPageTracker.name + '.send', 'pageview', "${gapath}");

      [/#if]

    </script>

  [/#if]
[/#macro]

[#macro googletagmanager account=gf.getConfigProperty('gato.tagmanager')]
  [#if cacheEnvironment]
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
  [#if cacheEnvironment]
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${account}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
  [/#if]
[/#macro]

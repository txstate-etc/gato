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

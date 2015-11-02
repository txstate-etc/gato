[#--
    Look up how to do this better once freemarker.org is back up
--]
[#assign index=0]
[#list components as component]
    [#if index > 0]
        |
    [/#if]
    [@cms.component content=component /]
    [#assign index = index + 1]
[/#list]

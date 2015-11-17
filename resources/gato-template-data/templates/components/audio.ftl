<div class="gato-textimage">
  [#if content.title?has_content]
    <h2 class="gato-textimage-title">
      ${content.title}
    </h2>
  [/#if]
  ${cmsfn.decode(content).lyrics!}
</div>
<br/><hr/><br/>

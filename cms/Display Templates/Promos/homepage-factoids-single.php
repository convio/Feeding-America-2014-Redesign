<t:set id="colorClass" value="'transparent'" />
<t:if test="promo_background_color.length > 0"><t:list id="promo_background_color">
  <t:if test="matches(name, '.*wheatstalk.*')">
    <t:set id="colorClass" value="replace(name, '-', ' ')" />
  </t:if>
  <t:else>
    <t:set id="colorClass" value="name" />
  </t:else>
</t:list></t:if>


<div id="homepage_fivesteps" class="${colorClass}">
  <div class="container">
    <t:if test="!isNull(headline)"><div class="headline">${headline}</div></t:if>
      ${body}
  </div><!--/.container-->
</div><!--/#homepage_fivesteps-->

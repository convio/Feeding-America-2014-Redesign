<t:if test="length > 0">
  <t:list>
    <div class="inline-promo orange hidden-phone promo">
      <t:if test="thumb.length > 0"><div class="inline-promo-image"><t:if test="!isNull(action_button_url)"><a href="${action_button_url}"></t:if><t:list id="thumb"><img src="${url}" alt="${alt_text}" border="0" /></t:list><t:if test="!isNull(action_button_url)"></a></t:if></div></t:if>
      <div class="inline-promo-text"><t:if test="!isNull(action_button_url) && !isNull(headline)"><a href="${action_button_url}"></t:if>${title}<t:if test="!isNull(action_button_url)"></a></t:if></div>
      <div class="clearfix"></div>
    </div><!--/.inline-promo.orange-->
  </t:list>
</t:if>
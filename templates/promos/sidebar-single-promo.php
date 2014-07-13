    <t:set id="classes" value="''" />
    <t:if test="thumb.length > 0">
      <t:set id="classes" value="'icon'" />
    </t:if>
    <t:if test="promo_background_color.length > 0"><t:list id="promo_background_color">
      <t:set id="classes" value="concat(concat(classes, ' '), name)" />
    </t:list></t:if>
    <div class="sidebar-promo-box promo">
      <div class="sidebar-promo  ${classes}">
        <t:if test="!isNull(action_button_url)"><a href="${action_button_url}"></t:if>
        <t:if test="thumb.length > 0"><t:list id="thumb"><img src="${url}" alt="${alt_text}" /></t:list></t:if>
        <span class="small">${title}</span>
        <t:if test="!isNull(description)"><span class="big">${description}</span></t:if>
        <t:if test="!isNull(action_button_url)"></a></t:if>
      </div><!-- /.sidebar-promo -->
    </div><!-- /.sidebar-promo-box -->
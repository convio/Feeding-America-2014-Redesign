    <t:set id="classes" value="'standard'" />
    <t:if test="thumb.length > 0">
      <t:set id="classes" value="'icon'" />
    </t:if>
    <t:if test="promo_background_color.length > 0"><t:list id="promo_background_color">
      <t:set id="classes" value="concat(concat(classes, ' '), name)" />
    </t:list></t:if>

    <t:set id="buttonClasses" value="'button'" />
    <t:if test="action_button_color.length > 0 || action_button_style.length > 0">
      <t:if test="action_button_style.length > 0">
        <t:list id="action_button_style">
          <t:set id="buttonClasses" value="name" />
        </t:list>
      </t:if>
      <t:if test="action_button_color.length > 0">
        <t:list id="action_button_color">
          <t:set id="buttonClasses" value="concat(concat(buttonClasses, ' '), name)" />
        </t:list>
      </t:if>
    </t:if>
    <div class="sidebar-promo-box promo">
      <div class="sidebar-promo  ${classes}">
        <t:if test="!isNull(action_button_url) && isNull(action_button_label)"><a href="${action_button_url}"></t:if>
        <t:if test="thumb.length > 0"><t:list id="thumb"><img src="${url}" alt="${alt_text}" /></t:list></t:if>
        <t:if test="!isNull(headline)"><span class="small">${headline}</span></t:if>
        <t:if test="!isNull(description)"><span class="big">${description}</span></t:if>
        <t:if test="!isNull(action_button_label) && !isNull(action_button_url)"><a class="${buttonClasses}" href="${action_button_url}">${action_button_label}</a></t:if>
        <t:if test="!isNull(action_button_url) && isNull(action_button_label)"></a></t:if>
      </div><!-- /.sidebar-promo -->
    </div><!-- /.sidebar-promo-box -->
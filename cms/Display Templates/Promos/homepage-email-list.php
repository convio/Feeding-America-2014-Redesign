<t:if test="length > 0">
  <t:list>

    <t:set id="classes" value="'transparent '" />
    <t:if test="promo_background_color.length > 0"><t:list id="promo_background_color">
      <t:if test="matches(name, '.*wheatstalk.*')">
        <t:set id="classes" value="replace(name, '-', ' ')" />
      </t:if>
      <t:else>
        <t:set id="classes" value="name" />
      </t:else>
    </t:list></t:if>

    <t:set id="promoBgImg" value="''" />
    <t:if test="background_image.length > 0">
      <t:list id="background_image">
        <t:set id="promoBgImg" value="concat('background: url(', url)" />
        <t:set id="promoBgImg" value="concat(promoBgImg, ') 50% 0 repeat;')" />
      </t:list>
    </t:if>

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

    <div class="homepage_email ${classes}" style="${promoBgImg}">
      <div class="container">
        <t:if test="!isNull(headline)"><div class="headline">${headline}</div></t:if>
        <t:if test="!isNull(description)"><p>${description}</p></t:if>
        ${body}
        <t:if test="!isNull(action_button_label) && !isNull(action_button_url)"><a class="${buttonClasses}" href="${action_button_url}">${action_button_label}</a></t:if>
      </div><!--/.container-->
    </div><!--/.homepage_email-->

  </t:list>
</t:if>
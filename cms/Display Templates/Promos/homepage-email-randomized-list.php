<t:if test="length > 0">
  <t:set id="rand" value="random(4)+1" />
  <t:list>
    <t:if test="index == rand">
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

      <div class="homepage_email ${classes}" style="${promoBgImg}">
        <div class="container">
          <t:if test="!isNull(headline)"><div class="headline">${headline}</div></t:if>
          <t:if test="!isNull(description)"><p>${description}</p></t:if>
          ${body}
        </div><!--/.container-->
      </div><!--/.homepage_email-->
    </t:if>

  </t:list>
</t:if>
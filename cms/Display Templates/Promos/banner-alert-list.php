<t:if test="length > 0">
  <t:list>
    <t:if test="filename != 'blank.html'">
      <t:set id="promoBgImg" value="''" />
      <t:set id="promoBgColor" value="'orange'" />

      <t:if test="background_image.length > 0">
        <t:list id="background_image">
          <t:set id="promoBgImg" value="concat('background: url(', url)" />
          <t:set id="promoBgImg" value="concat(promoBgImg, ') 50% 0 repeat;')" />
        </t:list>
      </t:if>

      <t:if test="promo_background_color.length > 0">
        <t:list id="promo_background_color">
          <t:set id="promoBgColor" value="name" />
        </t:list>
      </t:if>

      <div class="alert-banner promo ${promoBgColor}" style="${promoBgImg}">
        <div class="container">
          <div class="alert-content">
            <t:if test="thumb.length > 0"><t:list id="thumb"><img src="${url}" alt="${alt_text}" class="icon-left" /></t:list></t:if>
            <div class="alert-text">${body}</div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

    </t:if>
  </t:list>
</t:if>
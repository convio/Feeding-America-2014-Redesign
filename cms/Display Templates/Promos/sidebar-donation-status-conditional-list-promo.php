  <t:if test="length > 0">

    <t:set id="showComments" value="false" />
    <t:set id="itemDisplayed" value="0" />
    <t:set id="giveConditionalCategory1" value="'default-anonymous'" />
    <t:set id="giveConditionalCategory2" value="null" />

    <t:if test="showComments"><!--  set conditionals based on user record --></t:if>
    <t:if test="user.isanonymous == false">
      <t:set id="giveConditionalCategory1" value="'logged-in'" />

      <t:if test="isNull(crm('[[S1:external_lifetime_gift_amount]]'))">
        <t:set id="giveConditionalCategory2" value="'not-a-donor'" />
      </t:if>
      <t:else>
        <t:set id="giveConditionalCategory2" value="'donor'" />
          <t:if test="crm('[[S1:sustained_status]]') == 'Current Sustaining Donor'">
            <t:set id="giveConditionalCategory2" value="'monthly-donor'" />
          </t:if>
      </t:else>
      <t:if test="cons.custom.custom_boolean11 == true || cons.custom.custom_boolean12 == true || cons.custom.custom_boolean13 == true || cons.custom.custom_boolean24 == true || cons.custom.custom_boolean30 == true || cons.custom.custom_boolean35 == true">
        <t:set id="giveConditionalCategory2" value="'mid-level-flag'" />
      </t:if>
    </t:if>

    <t:list>
      <t:set id="displayItem" value="0" />

      <t:if test="!isNull(giveConditionalCategory1)"><t:set id="giveMatchedCategory1" value="0" /></t:if>
      <t:if test="!isNull(giveConditionalCategory2)"><t:set id="giveMatchedCategory2" value="0" /></t:if>

      <t:if test="showComments"><!-- match conditions against categories & set the match variables --></t:if>
      <t:list id="promo_conditional_logic">
        <t:if test="!isNull(giveConditionalCategory1) && name == giveConditionalCategory1">
          <t:set id="giveMatchedCategory1" value="1" />
        </t:if>
        <t:if test="!isNull(giveConditionalCategory2) && name == giveConditionalCategory2">
          <t:set id="giveMatchedCategory2" value="1" />
        </t:if>
    </t:list>


      <t:if test="showComments"><!-- determine matches for the promo --></t:if>
      <t:if test="!isNull(giveConditionalCategory1) && !isNull(giveConditionalCategory2)">
        <t:if test="giveMatchedCategory1 == 1 && giveMatchedCategory2 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(giveConditionalCategory1) && isNull(giveConditionalCategory2)">
        <t:if test="giveMatchedCategory1 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="displayItem == 1 && itemDisplayed == 0">
        <t:set id="itemDisplayed" value="1" />

          <t:set id="classes" value="'standard'" />
          <t:if test="thumb.length > 0">
            <t:set id="classes" value="'icon'" />
          </t:if>

          <t:set id="colorClass" value="'transparent'" />
          <t:if test="promo_background_color.length > 0"><t:list id="promo_background_color">
            <t:if test="matches(name, '.*wheatstalk.*')">
              <t:set id="colorClass" value="replace(name, '-', ' ')" />
            </t:if>
            <t:else>
              <t:set id="colorClass" value="name" />
            </t:else>
          </t:list></t:if>

          <t:set id="classes" value="concat(concat(classes, ' '), colorClass)" />

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
          <t:set id="promoBgImg" value="''" />
          <t:if test="background_image.length > 0">
            <t:list id="background_image">
              <t:set id="promoBgImg" value="concat('background: url(', url)" />
              <t:set id="promoBgImg" value="concat(promoBgImg, ') 50% 0 repeat;')" />
            </t:list>
          </t:if>

          <div class="sidebar-promo-box promo">
            <div class="sidebar-promo  ${classes}" style="${promoBgImg}">
              <t:if test="thumb.length > 0">
                <t:if test="!isNull(action_button_url) && isNull(action_button_label)"><a href="${action_button_url}"></t:if>
                <t:list id="thumb"><img src="${url}" alt="${alt_text}" /></t:list>
                <t:if test="!isNull(action_button_url) && isNull(action_button_label)"></a></t:if>
              </t:if>
              <t:if test="!isNull(headline)">
                <t:if test="!isNull(action_button_url) && isNull(action_button_label)"><a href="${action_button_url}"></t:if>
                <span class="small">${headline}</span>
                <t:if test="!isNull(action_button_url) && isNull(action_button_label)"></a></t:if>
              </t:if>
              <t:if test="!isNull(description)">
                <t:if test="!isNull(action_button_url) && isNull(action_button_label)"><a href="${action_button_url}"></t:if>
                <span class="big">${description}</span>
                <t:if test="!isNull(action_button_url) && isNull(action_button_label)"></a></t:if>
              </t:if>
              <t:if test="!isNull(body)">${body}</t:if>
              <t:if test="!isNull(action_button_label) && !isNull(action_button_url)"><a class="${buttonClasses}" href="${action_button_url}">${action_button_label}</a></t:if>
            </div><!-- /.sidebar-promo -->
          </div><!-- /.sidebar-promo-box -->


        </t:if>

    </t:list>

  </t:if>
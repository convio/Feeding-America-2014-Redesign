<t:if test="length > 0">

  <t:set id="showComments" value="false" />
  <t:set id="itemDisplayed" value="0" />
  <t:set id="joinConditionalCategory1" value="'default-anonymous'" />
  <t:set id="joinConditionalCategory2" value="null" />
  <t:set id="joinConditionalCategory3" value="null" />

  <t:set id="actConditionalCategory1" value="'default-anonymous'" />
  <t:set id="actConditionalCategory2" value="null" />
  <t:set id="actConditionalCategory3" value="null" />

  <t:set id="giveConditionalCategory1" value="'default-anonymous'" />
  <t:set id="giveConditionalCategory2" value="null" />
  <t:set id="giveConditionalCategory3" value="null" />


  <t:if test="showComments"><!-- conditionals for Join/Learn --></t:if>
  <t:if test="user.isanonymous == false && cons.email.accepts_email == true">
    <t:set id="joinConditionalCategory1" value="'logged-in'" />
    <t:set id="joinConditionalCategory2" value="'signed-up-for-email'" />
      <t:if test="isNull(cons.primary_address.zip)">
        <t:set id="joinConditionalCategory3" value="'no-zip-on-file'" />
      </t:if>
      <t:else>
        <t:set id="joinConditionalCategory3" value="'zip-on-file'" />
      </t:else>
  </t:if>

  <t:if test="showComments"><!-- conditionals for Act/Share --></t:if>
  <t:if test="user.isanonymous == false">
    <t:set id="actConditionalCategory1" value="'logged-in'" />
      <t:set id="alertList" value="crm('[[S96:region:allalerts:numLinks:999999:issue:-1:desc:no:date:no:stats:statistics:tafLink:title:sortBy:action:listStyle:number]]')" />
      <t:set id="alertList" value="trim(toText(alertList, 'a'))" />
      <t:if test="!isNull(alertList)">
        <t:set id="actConditionalCategory2" value="'took-action'" />
      </t:if>
      <t:else>
        <t:set id="actConditionalCategory2" value="'did-not-take-action'" />
      </t:else>
  </t:if>

  <t:if test="showComments"><!-- conditionals for Give/Thanks --></t:if>
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
    <t:list id="promo_type"><t:set id="promoCategory" value="name" /></t:list>

    <t:if test="!isNull(joinConditionalCategory1)"><t:set id="joinMatchedCategory1" value="0" /></t:if>
    <t:if test="!isNull(joinConditionalCategory2)"><t:set id="joinMatchedCategory2" value="0" /></t:if>
    <t:if test="!isNull(joinConditionalCategory3)"><t:set id="joinMatchedCategory3" value="0" /></t:if>
    <t:if test="!isNull(actConditionalCategory1)"><t:set id="actMatchedCategory1" value="0" /></t:if>
    <t:if test="!isNull(actConditionalCategory2)"><t:set id="actMatchedCategory2" value="0" /></t:if>
    <t:if test="!isNull(giveConditionalCategory1)"><t:set id="giveMatchedCategory1" value="0" /></t:if>
    <t:if test="!isNull(giveConditionalCategory2)"><t:set id="giveMatchedCategory2" value="0" /></t:if>
    <t:if test="!isNull(giveConditionalCategory3)"><t:set id="giveMatchedCategory3" value="0" /></t:if>

    <t:if test="showComments"><!-- match conditions against categories & set the match variables --></t:if>
    <t:list id="promo_conditional_logic">
      <t:if test="!isNull(joinConditionalCategory1) && name == joinConditionalCategory1">
        <t:set id="joinMatchedCategory1" value="1" />
      </t:if>
      <t:if test="!isNull(joinConditionalCategory2) && name == joinConditionalCategory2">
        <t:set id="joinMatchedCategory2" value="1" />
      </t:if>
      <t:if test="!isNull(joinConditionalCategory3) && name == joinConditionalCategory3">
        <t:set id="joinMatchedCategory3" value="1" />
      </t:if>

      <t:if test="!isNull(actConditionalCategory1) && name == actConditionalCategory1">
        <t:set id="actMatchedCategory1" value="1" />
      </t:if>
      <t:if test="!isNull(actConditionalCategory2) && name == actConditionalCategory2">
        <t:set id="actMatchedCategory2" value="1" />
      </t:if>

      <t:if test="!isNull(giveConditionalCategory1) && name == giveConditionalCategory1">
        <t:set id="giveMatchedCategory1" value="1" />
      </t:if>
      <t:if test="!isNull(giveConditionalCategory2) && name == giveConditionalCategory2">
        <t:set id="giveMatchedCategory2" value="1" />
      </t:if>
      <t:if test="!isNull(giveConditionalCategory3) && name == giveConditionalCategory3">
        <t:set id="giveMatchedCategory3" value="1" />
      </t:if>
    </t:list>

    <t:if test="promoCategory == 'footer-join-learn'">
      <t:if test="showComments"><!-- determine matches for Join/Learn promo --></t:if>
      <t:if test="!isNull(joinConditionalCategory1) && !isNull(joinConditionalCategory2) && !isNull(joinConditionalCategory3)">
        <t:if test="joinMatchedCategory1 == 1 && joinMatchedCategory2 == 1 && joinMatchedCategory3 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(joinConditionalCategory1) && !isNull(joinConditionalCategory2) && isNull(joinConditionalCategory3)">
        <t:if test="joinMatchedCategory1 == 1 && joinMatchedCategory2 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(joinConditionalCategory1) && isNull(joinConditionalCategory2) && isNull(joinConditionalCategory3)">
        <t:if test="joinMatchedCategory1 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>
    </t:if>

    <t:if test="promoCategory == 'footer-act-share'">
      <t:if test="showComments"><!-- determine matches for Act/Share promo --></t:if>
      <t:if test="!isNull(actConditionalCategory1) && !isNull(actConditionalCategory2) && !isNull(actConditionalCategory3)">
        <t:if test="actMatchedCategory1 == 1 && actMatchedCategory2 == 1 && actMatchedCategory3 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(actConditionalCategory1) && !isNull(actConditionalCategory2) && isNull(actConditionalCategory3)">
        <t:if test="actMatchedCategory1 == 1 && actMatchedCategory2 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(actConditionalCategory1) && isNull(actConditionalCategory2) && isNull(actConditionalCategory3)">
        <t:if test="actMatchedCategory1 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>
    </t:if>

    <t:if test="promoCategory == 'footer-give-thanks'">
      <t:if test="showComments"><!-- determine matches for Give/Thanks promo --></t:if>
      <t:if test="!isNull(giveConditionalCategory1) && !isNull(giveConditionalCategory2) && !isNull(giveConditionalCategory3)">
        <t:if test="giveMatchedCategory1 == 1 && giveMatchedCategory2 == 1 && giveMatchedCategory3 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(giveConditionalCategory1) && !isNull(giveConditionalCategory2) && isNull(giveConditionalCategory3)">
        <t:if test="giveMatchedCategory1 == 1 && giveMatchedCategory2 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>

      <t:if test="!isNull(giveConditionalCategory1) && isNull(giveConditionalCategory2) && isNull(giveConditionalCategory3)">
        <t:if test="giveMatchedCategory1 == 1">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:if>
    </t:if>


    <t:if test="displayItem == 1 && itemDisplayed == 0">
      <t:set id="itemDisplayed" value="1" />

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

      <div class="footer-promo">
        <t:if test="thumb.length > 0">
          <t:if test="isNull(action_button_label) && !isNull(action_button_url)"><a href="${action_button_url}"></t:if>
          <t:list id="thumb"><img src="${url}" alt="${alt_text}" /></t:list>
          <t:if test="isNull(action_button_label) && !isNull(action_button_url)"></a></t:if>
        </t:if>
        <t:if test="!isNull(headline)"><div class="promo-title"><t:if test="isNull(action_button_label) && !isNull(action_button_url)"><a href="${action_button_url}"></t:if>${headline}<t:if test="isNull(action_button_label) && !isNull(action_button_url)"></a></t:if></div></t:if>
        <t:if test="!isNull(description)"><div class="promo-text"><t:if test="isNull(action_button_label) && !isNull(action_button_url)"><a href="${action_button_url}"></t:if>${description}<t:if test="isNull(action_button_label) && !isNull(action_button_url)"></a></t:if></div></t:if>
        <t:if test="!isNull(body)"><div class="promo-action">${body}</div></t:if>
        <t:if test="!isNull(action_button_label) && !isNull(action_button_url)">
          <div class="promo-action">
            <t:if test="promoCategory == 'footer-join-learn' && joinConditionalCategory3 == 'zip-on-file'">
              <t:if test="matches('.*?.*', action_button_url)"><a class="${buttonClasses}" href="${action_button_url}&zip=${cons.primary_address.zip}"></t:if>
              <t:else><a class="${buttonClasses}" href="${action_button_url}?zip=${cons.primary_address.zip}"></t:else>
            </t:if>
            <t:else><a class="${buttonClasses}" href="${action_button_url}"></t:else>${action_button_label}</a>
          </div><!-- /.promo-action-->
        </t:if>
      </div><!--/.footer-promo-->

      <t:if test="promoCategory == 'footer-join-learn'">
      <div class="debug" style="display:none;">Join: ${joinConditionalCategory1} ${joinConditionalCategory2} ${joinConditionalCategory3} - <t:value id="promo_conditional_logic" /></div></t:if>
      <t:if test="promoCategory == 'footer-act-share'">
      <div class="debug" style="display:none;">Act: ${actConditionalCategory1} ${actConditionalCategory2} ${actConditionalCategory3} - <t:value id="promo_conditional_logic" /></div></t:if>
      <t:if test="promoCategory == 'footer-give-thanks'">
      <div class="debug" style="display:none;">Act: ${giveConditionalCategory1} ${giveConditionalCategory2} ${giveConditionalCategory3} - <t:value id="promo_conditional_logic" /></div></t:if>
    </t:if><!-- /displayItem && itemDisplayed -->
  </t:list>



  <div class="debug" style="display:none;">
    <t:set id="userStatus" value="user.isanonymous" />Anonymous: ${userStatus}
    <t:set id="userStatus" value="crm('[[S1:accepts_email]]')" />Accepts Email: ${userStatus}
    <t:set id="userStatus" value="cons.primary_address.zip" />Primary Zip: ${userStatus}
    <t:set id="userStatus" value="isNull(cons.primary_address.zip)" />Primary Zip Null: ${userStatus}
    <t:set id="userStatus" value="!isNull(alertList)" />Action taken: ${userStatus}
    <t:set id="userStatus" value="crm('[[S1:external_lifetime_gift_amount]]')" />Lifetime Gift Amount: ${userStatus}
    <t:set id="userStatus" value="isNull(crm('[[S1:external_lifetime_gift_amount]]'))" />Null Lifetime Gift Amount: ${userStatus}
    <t:set id="userStatus" value="crm('[[S1:donor_status]]')" />Donor Status: ${userStatus}
    <t:set id="userStatus" value="crm('[[S1:sustained_status]]') == 'Current Sustaining Donor'" />Sustaining Donor: ${userStatus}
    <t:set id="userStatus" value="crm('[[S1:custom_boolean11]]') == true || crm('[[S1:custom_boolean12]]') == true || crm('[[S1:custom_boolean13]]') == true || crm('[[S1:custom_boolean24]]') == true || crm('[[S1:custom_boolean30]]') == true || crm('[[S1:custom_boolean35]]') == true" />Mid-level flag: ${userStatus}
    <t:set id="userStatus" value="cons.custom.custom_boolean11 == true || cons.custom.custom_boolean12 == true || cons.custom.custom_boolean13 == true || cons.custom.custom_boolean24 == true || cons.custom.custom_boolean30 == true || cons.custom.custom_boolean35 == true" />CMS Mid-level flag: ${userStatus}
  </div>

</t:if>
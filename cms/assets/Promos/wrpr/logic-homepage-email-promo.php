  <t:set id="emailConditionalCategory1" value="'default-anonymous'" />
  <t:set id="emailConditionalCategory2" value="null" />
  <t:set id="emailConditionalCategory3" value="null" />

  <t:if test="user.isanonymous == false && cons.email.accepts_email == true">
    <t:set id="emailConditionalCategory1" value="'signed-up-for-email'" />

    <t:if test="isGroupMember('96601')">
      <t:set id="emailConditionalCategory2" value="'in-group-96601-pledge'" />
    </t:if>
    <t:else>
      <t:set id="emailConditionalCategory2" value="'not-in-group-96601-pledge'" />
    </t:else>

    <t:if test="isGroupMember('80921')">
      <t:set id="emailConditionalCategory3" value="'in-group-80921-action'" />
    </t:if>
    <t:else>
      <t:set id="emailConditionalCategory3" value="'not-in-group-80921-action'" />
    </t:else>
  </t:if>

  <t:if test="emailConditionalCategory1 == 'default-anonymous'">
    <!-- generic list of 1 homepage email promo tagged as default -->
    <t:include id="templatelist-545524143" />
  </t:if>
  <t:else>
    <t:if test="!isNull(emailConditionalCategory2) && !isNull(emailConditionalCategory3)">

      <t:if test="emailConditionalCategory2 == 'not-in-group-96601-pledge'">
      <!-- promos tagged as logged in, signed up for email & not in pledge group -->
      <t:include id="templatelist-546370947" />

      </t:if>

      <t:if test="emailConditionalCategory2 == 'in-group-96601-pledge' && emailConditionalCategory3 == 'not-in-group-80921-action'">
      <!-- promos tagged as logged in, signed up for email & in pledge group & not in action group-->
      <t:include id="templatelist-546371358" />

      </t:if>

      <t:if test="emailConditionalCategory2 == 'in-group-96601-pledge' && emailConditionalCategory3 == 'in-group-80921-action'">
      <!-- promos tagged as logged in, signed up for email & in pledge group & in action group-->
      <t:include id="templatelist-546371705" />

      </t:if>

    </t:if>
  </t:else>

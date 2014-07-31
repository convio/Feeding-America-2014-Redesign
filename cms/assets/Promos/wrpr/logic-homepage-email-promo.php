  <t:set id="emailConditionalCategory" value="'default-anonymous'" />
  <t:if test="user.isanonymous == false && cons.email.accepts_email == true">
    <t:set id="emailConditionalCategory" value="'signed-up-for-email'" />
  </t:if>

  <t:if test="emailConditionalCategory == 'default-anonymous'">
    <!-- generic list of 1 homepage email promo tagged as default -->
    <t:include id="templatelist-545524143" />
  </t:if>
  <t:else>
    <!-- generic randomized list of homepage email promos tagged with logged in & email on file -->
    <t:include id="templatelist-545524317" />
  </t:else>


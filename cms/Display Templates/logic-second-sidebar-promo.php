<div class="promos">
  <t:set id="emailConditionalCategory" value="'default-anonymous'" />
  <t:if test="user.isanonymous == false && !isNull(cons.email.primary_address)">
    <t:set id="emailConditionalCategory" value="'email-on-file'" />
  </t:if>

  <div class="primary-promos">
    <!-- global promos -->
    <t:if test="emailConditionalCategory == 'default-anonymous'">
      <!-- global list of default/anon secondary promos -->
      <t:include id="templatelist-541720519" />
    </t:if>
    <t:else>
    <!-- global randomized list of secondary promos tagged with logged in & email on file -->
      <t:include id="templatelist-542289635" />
    </t:else>
  </div>

  <div class="secondary-promos">
    <t:if test="emailConditionalCategory == 'default-anonymous'">
      <!-- generic list of default secondary promos -->
    <t:include id="templatelist-541720172" />
    </t:if>
    <t:else>
      <!-- generic randomized list of secondary promos tagged with logged in & email on file -->
      <t:include id="templatelist-542291343" />
    </t:else>
  </div>
</div><!-- /.promos -->
<t:if test="length > 0">
  <t:set id="sourceCode" value="param.s_src" />
  <t:if test="isNull(sourceCode)">
    <t:set id="sourceCode" value="crm('[[S80:src]]')" />
  </t:if>
  <t:set id="cookieValue" value="replace(replace(replace(header.cookie, '(', ''), ')', ''), '=', '') " />

  <t:set id="itemDisplayed" value="0" />
  <t:set id="conditionalCategory" value="null" />

  <t:if test="!isNull(sourceCode) && substring(sourceCode, 0, 1) == 'Y' && substring(sourceCode, 4,5) == 'A'">
    <!-- from donated media -->
    <t:set id="conditionalCategory" value="'donated-media'" />
  </t:if>
  <t:else>
    <t:if test="matches(cookieValue, '.*utmccndirect.*')">
      <!-- direct -->
      <t:set id="conditionalCategory" value="'direct'" />
    </t:if>
    <t:if test="matches(cookieValue, '.*utmccnreferral.*')">
      <!-- referral -->
      <t:set id="conditionalCategory" value="'referral'" />
    </t:if>
    <t:if test="matches(cookieValue, '.*utmccnorganic.*')">
      <!-- organic -->
      <t:set id="conditionalCategory" value="'organic-search'" />
    </t:if>
  </t:else>

  <t:list>
    <t:if test="filename != 'blank.html'">
      <t:set id="displayItem" value="0" />
      <t:list id="promo_conditional_logic">
        <t:if test="!isNull(conditionalCategory) && name == conditionalCategory">
          <t:set id="displayItem" value="1" />
        </t:if>
      </t:list>

      <t:if test="displayItem == 1 && itemDisplayed == 0">
        <t:set id="itemDisplayed" value="1" />

        <div class="interrupter promo closed">
          <div class="int-buttons">
            <a href="#" class="int-btn-open"><img src="http://fa.pub30.convio.net/assets/images/int-btn-open.png" border="0" /></a>
            <a href="#" class="int-btn-close"><img src="http://fa.pub30.convio.net/assets/images/int-btn-close.png" border="0" /></a>
          </div><!--/.int-buttons-->
          <t:if test="background_image.length > 0">
            <t:list id="background_image"><img src="${url}" alt="${alt_text}" class="int-left-img" border="0" /></t:list>
          </t:if>
          <div class="int-text">
            ${body}
          </div><!--/.int-text-->
          <t:if test="thumb.length > 0">
            <t:list id="thumb">
              <img src="${url}" alt="${alt_text}" class="int-icon" border="0" />
            </t:list>
          </t:if>
          <div class="clearfix"></div>
        </div><!--/.interrupter-->
      </t:if>
    </t:if>
  </t:list>
</t:if>
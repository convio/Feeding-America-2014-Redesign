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
  <t:if test="!isNull(action_button_label) && !isNull(action_button_url)"><div class="promo-action"><a class="${buttonClasses}" href="${action_button_url}">${action_button_label}</a></div></t:if>
</div><!--/.footer-promo-->
<t:if test="filename != 'blank.html'">
  <div class="interrupter closed">
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